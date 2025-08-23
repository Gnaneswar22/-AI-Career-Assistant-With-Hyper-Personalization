import os
from pathlib import Path

try:
	from dotenv import load_dotenv  # type: ignore
except Exception:  # pragma: no cover
	load_dotenv = None  # type: ignore

# Resolve project root and secrets path
CURRENT_DIR = Path(__file__).resolve().parent
SECRETS_PATH = CURRENT_DIR.parent / 'secrets' / '.env'

if load_dotenv is not None and SECRETS_PATH.exists():
	load_dotenv(SECRETS_PATH)

OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY', '')
OPENROUTER_API_URL = os.getenv('OPENROUTER_API_URL', 'https://openrouter.ai/api/v1/chat/completions')
DEFAULT_MODEL = os.getenv('OPENROUTER_MODEL', 'openrouter/auto')

if not OPENROUTER_API_KEY:
	# Soft warning for local dev; real deployments should ensure this is set
	print('[config] WARNING: OPENROUTER_API_KEY is not set. /api/chat will fail until configured.')