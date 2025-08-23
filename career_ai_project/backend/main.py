from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx

from .config import OPENROUTER_API_KEY, OPENROUTER_API_URL, DEFAULT_MODEL

app = FastAPI(title="CareerAI Backend")

# Allow all origins for simplicity in local dev (file:// origin will be 'null')
app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=False,
	allow_methods=["*"],
	allow_headers=["*"],
)

class ChatMessage(BaseModel):
	role: str
	content: str

class ChatRequest(BaseModel):
	messages: List[ChatMessage]
	model: Optional[str] = None
	temperature: Optional[float] = 0.7

class ChatResponse(BaseModel):
	role: str
	content: str
	raw: Optional[Dict[str, Any]] = None

@app.get("/health")
async def health() -> Dict[str, str]:
	return {"status": "ok"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat(req: ChatRequest) -> ChatResponse:
	if not OPENROUTER_API_KEY:
		raise HTTPException(status_code=500, detail="Server missing OPENROUTER_API_KEY")

	headers = {
		"Authorization": f"Bearer {OPENROUTER_API_KEY}",
		"Content-Type": "application/json",
		# Optional but recommended by OpenRouter
		"HTTP-Referer": "http://localhost",
		"X-Title": "CareerAI",
	}
	payload: Dict[str, Any] = {
		"model": req.model or DEFAULT_MODEL,
		"messages": [m.model_dump() for m in req.messages],
		"temperature": req.temperature,
	}

	async with httpx.AsyncClient(timeout=60.0) as client:
		resp = await client.post(OPENROUTER_API_URL, headers=headers, json=payload)
		if resp.status_code >= 400:
			raise HTTPException(status_code=resp.status_code, detail=resp.text)
		data = resp.json()

	# Align with OpenAI-style response shape
	try:
		choice = data["choices"][0]
		msg = choice["message"]
		return ChatResponse(role=msg.get("role", "assistant"), content=msg.get("content", ""), raw=data)
	except Exception as exc:  # pragma: no cover
		raise HTTPException(status_code=500, detail=f"Malformed response: {exc}")

# If you want to run: uvicorn backend.main:app --reload --port 8000