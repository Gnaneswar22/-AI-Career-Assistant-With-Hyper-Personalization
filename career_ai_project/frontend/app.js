/* Store and Actions */
const Store = (() => {
	const initialState = {
		auth: { user: null },
		profile: { name: '', role: '', skills: [] },
		roadmaps: [],
		courses: [],
		projects: [],
		resume: { name: '', education: '', experience: '', skills: '', projects: '' },
		jobsApplied: [],
		community: { posts: [] },
		mentor: { messages: [] },
	};

	function load() {
		try { return JSON.parse(localStorage.getItem('careerai_state') || ''); } catch { return null; }
	}
	function save(state) { try { localStorage.setItem('careerai_state', JSON.stringify(state)); } catch {}
	}

	let state = load() || initialState;
	const subscribers = new Set();
	function getState() { return state; }
	function setState(next) { state = next; save(state); subscribers.forEach(fn => fn(state)); }
	function update(partial) { setState({ ...state, ...partial }); }
	function updateKey(key, updater) { setState({ ...state, [key]: updater(state[key]) }); }
	function subscribe(fn) { subscribers.add(fn); return () => subscribers.delete(fn); }

	const Actions = {
		login(email) {
			const user = { id: Date.now().toString(), email };
			update({ auth: { user } });
		},
		signup(name, email) {
			const user = { id: Date.now().toString(), name, email };
			update({ auth: { user }, profile: { ...state.profile, name, role: '', skills: [] } });
		},
		logout() { update({ auth: { user: null } }); },
		addRoadmap(item) { updateKey('roadmaps', arr => [...arr, { ...item, progress: 0 }]); },
		addCourse(item) { updateKey('courses', arr => [...arr, { ...item, status: 'Not Started' }]); },
		startCourse(title) { updateKey('courses', arr => arr.map(c => c.title === title ? { ...c, status: 'In Progress' } : c)); },
		completeCourse(title) { updateKey('courses', arr => arr.map(c => c.title === title ? { ...c, status: 'Completed' } : c)); },
		addProject(name) { updateKey('projects', arr => [...arr, { name, status: 'Active' }]); },
		completeProject(name) { updateKey('projects', arr => arr.map(p => p.name === name ? { ...p, status: 'Completed' } : p)); },
		applyJob(job) { updateKey('jobsApplied', arr => [...arr, job]); },
		saveResume(data) { update({ resume: { ...state.resume, ...data } }); },
		updateProfile(data) { update({ profile: { ...state.profile, ...data } }); },
		pushMentorMessage(role, content) { updateKey('mentor', m => ({ ...m, messages: [...(m.messages || []), { role, content }] })); },
		clearMentor() { updateKey('mentor', _ => ({ messages: [] })); },
	};

	return { getState, setState, update, updateKey, subscribe, Actions };
})();

window.Store = Store; // for debugging
window.Actions = Store.Actions;

/* Router */
const routes = {
	"/": renderLanding,
	"/login": renderLogin,
	"/signup": renderSignup,
	"/dashboard": renderDashboard,
	"/roadmaps": renderRoadmaps,
	"/courses": renderCourses,
	"/projects": renderProjects,
	"/jobs": renderJobs,
	"/mentor": renderMentor,
	"/community": renderCommunity,
	"/profile": renderProfile,
	"/resume": renderResumeBuilder,
};
const publicRoutes = new Set(["/", "/login", "/signup"]);

function navigate(path) { window.location.hash = `#${path}`; }
function getPath() { const hash = window.location.hash || "#/"; return hash.replace(/^#/, ""); }

function onRouteChange() {
	const path = getPath();
	const view = document.getElementById("view");
	const { auth } = Store.getState();
	const isAuthed = !!auth.user;
	if (!isAuthed && !publicRoutes.has(path)) return renderAuthGate(view);
	const renderer = routes[path] || renderNotFound;
	view.innerHTML = "";
	renderer(view);
	setActiveLink(path);
	updateTopbar();
}

function setActiveLink(path) {
	document.querySelectorAll('.nav-link').forEach((link) => {
		if (link.getAttribute('href') === `#${path}`) link.classList.add('active');
		else link.classList.remove('active');
	});
}

function updateTopbar() {
	const actions = document.querySelector('.top-actions');
	if (!actions) return;
	const { auth } = Store.getState();
	if (auth.user) {
		actions.innerHTML = `
			<button class="icon-btn" title="Notifications"><i class="fa-regular fa-bell"></i></button>
			<button class="icon-btn" id="logoutBtn" title="Logout"><i class="fa-solid fa-right-from-bracket"></i></button>
		`;
		document.getElementById('logoutBtn').onclick = () => { Store.Actions.logout(); navigate('/'); };
	} else {
		actions.innerHTML = `
			<a class="btn primary" href="#/login">Sign In</a>
		`;
	}
}

window.addEventListener('hashchange', onRouteChange);
window.addEventListener('DOMContentLoaded', () => {
	onRouteChange();
	Store.subscribe(() => { updateTopbar(); });
});

/* Shared UI */
function createCard(html) { const el = document.createElement('div'); el.className = 'card'; el.innerHTML = html; return el; }
function progressBar(percent) { return `<div class="progress"><span style="width:${percent}%"></span></div>`; }
function emptyState(title, description, actionHtml = '') {
	return createCard(`
		<h3>${title}</h3>
		<p>${description}</p>
		<div class="row" style="margin-top:10px">${actionHtml}</div>
	`);
}

/* Public: Landing + Auth */
function renderLanding(root) {
	root.innerHTML = `
		<section class="landing">
			<div class="landing-hero">
				<h1>Your Hyper-Personalized Career GPS</h1>
				<p>Start clean. Add your goals as you go. No account yet? Sign up.</p>
				<div class="cta-buttons">
					<a class="btn primary" href="#/login">Login</a>
					<a class="btn secondary" href="#/signup">Sign Up</a>
				</div>
			</div>
		</section>
	`;
}

function renderAuthGate(root) {
	root.innerHTML = '';
	root.appendChild(emptyState(
		'Please sign in',
		'Access your dashboard, roadmaps, and more by signing in.',
		`<a class="btn primary" href="#/login">Sign In</a><a class="btn secondary" href="#/signup">Create Account</a>`
	));
}

function renderLogin(root) {
	const card = createCard(`
		<h3>Login</h3>
		<div class="form">
			<div class="field"><label>Email</label><input id="loginEmail" type="email" placeholder="you@example.com" /></div>
			<div class="form-actions">
				<button id="loginDo" class="btn primary">Login</button>
				<a class="btn secondary" href="#/signup">Go to Sign Up</a>
			</div>
		</div>
	`);
	root.appendChild(card);
	document.getElementById('loginDo').onclick = () => {
		const email = document.getElementById('loginEmail').value.trim();
		if (!email) return alert('Enter email');
		Store.Actions.login(email);
		navigate('/dashboard');
	};
}

function renderSignup(root) {
	const card = createCard(`
		<h3>Sign Up</h3>
		<div class="form">
			<div class="field"><label>Name</label><input id="suName" placeholder="Your name" /></div>
			<div class="field"><label>Email</label><input id="suEmail" type="email" placeholder="you@example.com" /></div>
			<div class="form-actions">
				<button id="suDo" class="btn primary">Create Account</button>
				<a class="btn secondary" href="#/login">Have an account? Login</a>
			</div>
		</div>
	`);
	root.appendChild(card);
	document.getElementById('suDo').onclick = () => {
		const name = document.getElementById('suName').value.trim();
		const email = document.getElementById('suEmail').value.trim();
		if (!name || !email) return alert('Enter name and email');
		Store.Actions.signup(name, email);
		navigate('/dashboard');
	};
}

/* Dashboard */
function renderDashboard(root) {
	const s1 = document.createElement('section');
	s1.className = 'section';
	s1.innerHTML = `<h2>Adaptive Roadmaps</h2>`;
	const { roadmaps } = Store.getState();
	if (!roadmaps.length) {
		s1.appendChild(emptyState('No roadmaps yet', 'Add your first roadmap to get started.', `<a class="btn primary" href="#/roadmaps">Browse Roadmaps</a>`));
	} else {
		const row = document.createElement('div'); row.className = 'row-scroll';
		roadmaps.forEach(({ title, progress }) => { row.appendChild(createCard(`<h3>${title}</h3>${progressBar(progress)}`)); });
		s1.appendChild(row);
	}

	const s2 = document.createElement('section');
	s2.className = 'section';
	s2.innerHTML = `<h2>Courses</h2>`;
	const { courses } = Store.getState();
	if (!courses.length) {
		s2.appendChild(emptyState('No courses yet', 'Add courses you want to learn.', `<a class="btn primary" href="#/courses">Add Course</a>`));
	} else {
		const grid = document.createElement('div'); grid.className = 'grid courses';
		courses.forEach(({ title, provider, status }) => {
			const statusClass = status === 'Completed' ? 'success' : status === 'In Progress' ? 'warning' : 'muted';
			grid.appendChild(createCard(`
				<h3>${title}</h3>
				<p>Provider: ${provider || 'N/A'}</p>
				<div class="badge ${statusClass}">${status}</div>
			`));
		});
	}

	const s3 = document.createElement('section');
	s3.className = 'section';
	s3.innerHTML = `<h2>Quick Actions</h2>`;
	const actions = document.createElement('div'); actions.className = 'row';
	[
		{ label: 'Build Resume', to: '/resume' },
		{ label: 'Start Project', to: '/projects' },
		{ label: 'Find Jobs', to: '/jobs' },
	].forEach(({ label, to }) => {
		const btn = document.createElement('a'); btn.className = 'btn primary'; btn.href = `#${to}`; btn.textContent = label; actions.appendChild(btn);
	});
	s3.appendChild(actions);

	root.appendChild(s1); root.appendChild(s2); root.appendChild(s3);
}

/* Roadmaps */
function renderRoadmaps(root) {
	root.innerHTML = `<h2>Adaptive Roadmaps</h2>`;
	const library = [
		{ title: 'Data Science' },
		{ title: 'Full Stack' },
		{ title: 'AI/ML' },
		{ title: 'Cloud' },
	];
	const row = document.createElement('div'); row.className = 'row-scroll';
	library.forEach(({ title }) => {
		const card = createCard(`
			<h3>${title}</h3>
			<p>Personalized steps to master ${title}.</p>
			<div class="row"><button class="btn secondary">Add</button></div>
		`);
		card.querySelector('button').onclick = () => { Store.Actions.addRoadmap({ title }); };
		row.appendChild(card);
	});
	root.appendChild(row);
}

/* Courses */
function renderCourses(root) {
	root.innerHTML = `<h2>Courses</h2>`;
	const { courses } = Store.getState();
	const grid = document.createElement('div'); grid.className = 'grid courses';
	if (!courses.length) {
		root.appendChild(emptyState('No courses yet', 'Add a course to begin learning.', `<button id="addCourse" class="btn primary">Add Sample Course</button>`));
		document.getElementById('addCourse').onclick = () => {
			Store.Actions.addCourse({ title: 'Machine Learning Specialization', provider: 'Coursera' });
			onRouteChange();
		};
		return;
	}
	courses.forEach(({ title, provider, status }) => {
		const statusClass = status === 'Completed' ? 'success' : status === 'In Progress' ? 'warning' : 'muted';
		const card = createCard(`
			<h3>${title}</h3>
			<p>Provider: ${provider || 'N/A'}</p>
			<div class="badge ${statusClass}">${status}</div>
			<div class="row" style="margin-top:10px">
				<button class="btn secondary">Start Course</button>
				<button class="btn secondary">Complete</button>
			</div>
		`);
		const [startBtn, completeBtn] = card.querySelectorAll('button');
		startBtn.onclick = () => { Store.Actions.startCourse(title); onRouteChange(); };
		completeBtn.onclick = () => { Store.Actions.completeCourse(title); onRouteChange(); };
		grid.appendChild(card);
	});
	root.appendChild(grid);
}

/* Projects */
function renderProjects(root) {
	const s1 = document.createElement('section'); s1.className = 'section'; s1.innerHTML = `<h2>Suggested Projects</h2>`;
	const suggestions = ['AI Study Planner', 'Job Match Recommender', 'Resume ATS Scanner', 'Cloud Cost Tracker'];
	const sg = document.createElement('div'); sg.className = 'grid projects';
	suggestions.forEach((p) => {
		const card = createCard(`<h3>${p}</h3><p>AI-suggested idea to build and showcase.</p><div class="row"><button class="btn primary">Start Project</button></div>`);
		card.querySelector('button').onclick = () => { Store.Actions.addProject(p); onRouteChange(); };
		sg.appendChild(card);
	});
	s1.appendChild(sg);

	const s2 = document.createElement('section'); s2.className = 'section'; s2.innerHTML = `<h2>Your Projects</h2>`;
	const { projects } = Store.getState();
	if (!projects.length) {
		s2.appendChild(emptyState('No projects yet', 'Start a project from suggestions above.'));
	} else {
		const list = document.createElement('div'); list.className = 'grid projects';
		projects.forEach((p) => {
			const card = createCard(`<h3>${p.name}</h3><div class="badge">${p.status}</div><div class="row"><button class="btn secondary">Mark Completed</button></div>`);
			card.querySelector('button').onclick = () => { Store.Actions.completeProject(p.name); onRouteChange(); };
			list.appendChild(card);
		});
		s2.appendChild(list);
	}

	root.appendChild(s1); root.appendChild(s2);
}

/* Jobs */
function renderJobs(root) {
	root.innerHTML = `<h2>Jobs</h2>`;
	const jobs = [
		{ title: 'Data Scientist', company: 'Acme Corp', match: 86 },
		{ title: 'Full Stack Engineer', company: 'Techify', match: 74 },
		{ title: 'ML Engineer', company: 'VisionAI', match: 67 },
	];
	const g = document.createElement('div'); g.className = 'grid';
	jobs.forEach((j) => {
		const card = createCard(`
			<div class="space-between">
				<div><h3>${j.title}</h3><p>${j.company}</p></div>
				<div class="badge">Match ${j.match}%</div>
			</div>
			<div class="row" style="margin-top:10px"><button class="btn primary">Apply</button></div>
		`);
		card.querySelector('button').onclick = () => { Store.Actions.applyJob(j); alert('Applied!'); };
		g.appendChild(card);
	});
	root.appendChild(g);

	const filter = document.createElement('aside'); filter.className = 'card'; filter.style.marginTop = '16px';
	filter.innerHTML = `
		<h3>Filters</h3>
		<div class="form">
			<div class="field"><label>Role</label><input placeholder="e.g. Data Scientist" /></div>
			<div class="field"><label>Location</label><input placeholder="e.g. Remote" /></div>
			<div class="field"><label>Experience</label><select><option>0-2 years</option><option>3-5 years</option><option>6+ years</option></select></div>
		</div>
	`;
	root.appendChild(filter);
}

/* Mentor */
async function callMentorAPI(messages) {
	const resp = await fetch('http://localhost:8000/api/chat', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ messages })
	});
	if (!resp.ok) throw new Error(`Chat error: ${resp.status}`);
	return resp.json();
}

function renderMentor(root) {
	root.innerHTML = `<h2>AI Mentor</h2>`;
	const wrap = document.createElement('div'); wrap.className = 'card';
	const { mentor } = Store.getState();
	const chatList = document.createElement('div');
	chatList.style.height = '300px'; chatList.style.overflow = 'auto'; chatList.style.display = 'grid'; chatList.style.gap = '8px';
	mentor.messages.forEach(m => {
		const bubble = document.createElement('div');
		bubble.className = 'badge'; bubble.textContent = `${m.role === 'assistant' ? 'Mentor' : 'You'}: ${m.content}`;
		chatList.appendChild(bubble);
	});
	const inputRow = document.createElement('div'); inputRow.className = 'row'; inputRow.style.marginTop = '10px';
	const input = document.createElement('input'); input.placeholder = 'Ask the AI mentor...'; input.style.flex = '1';
	const sendBtn = document.createElement('button'); sendBtn.className = 'btn primary'; sendBtn.textContent = 'Send';
	const quicks = [
		['Generate Resume', '/resume'],
		['View Roadmap', '/roadmaps'],
		['Suggest Project', '/projects'],
	];
	const quickWrap = document.createElement('div'); quickWrap.className = 'row';
	quicks.forEach(([label, to]) => { const a = document.createElement('a'); a.className = 'btn secondary'; a.href = `#${to}`; a.textContent = label; quickWrap.appendChild(a); });

	async function sendMessage() {
		const text = (input.value || '').trim();
		if (!text) return;
		Store.Actions.pushMentorMessage('user', text);
		renderMentor(root); // optimistic update
		try {
			const messages = [...Store.getState().mentor.messages, { role: 'user', content: text }].slice(-20);
			const res = await callMentorAPI(messages);
			Store.Actions.pushMentorMessage(res.role || 'assistant', res.content || '');
			renderMentor(root);
		} catch (e) {
			Store.Actions.pushMentorMessage('assistant', 'Sorry, I could not respond.');
			renderMentor(root);
		}
	}

	sendBtn.onclick = sendMessage;
	input.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });
	inputRow.appendChild(input); inputRow.appendChild(sendBtn);

	wrap.appendChild(chatList); wrap.appendChild(inputRow); wrap.appendChild(quickWrap);
	root.appendChild(wrap);
}

/* Community */
function renderCommunity(root) {
	const s1 = document.createElement('section'); s1.className = 'section'; s1.innerHTML = `<h2>Community</h2>`;
	const forums = document.createElement('div'); forums.className = 'grid';
	['Roadmaps', 'Courses', 'Projects', 'Jobs'].forEach((cat) => {
		forums.appendChild(createCard(`<h3>${cat}</h3><p>Discuss and share insights.</p><div class="row"><span class="badge">0 posts</span></div>`));
	});
	s1.appendChild(forums);

	const s2 = document.createElement('section'); s2.className = 'section'; s2.innerHTML = `<h2>Leaderboard</h2>`;
	s2.appendChild(createCard(`<div class="row"><span class="badge">XP: 0</span><span class="badge">Badges: 0</span><span class="badge">Streak: 0</span></div>`));

	root.appendChild(s1); root.appendChild(s2);
}

/* Profile */
function renderProfile(root) {
	const { profile } = Store.getState();
	const card = createCard(`
		<div class="row" style="gap:16px">
			<div style="width:64px; height:64px; border-radius:50%; background: #e5e7eb;"></div>
			<div>
				<h3>${profile.name || 'Your Name'}</h3>
				<p>${profile.role || 'Your Role'} • ${(profile.skills || []).join(', ')}</p>
			</div>
		</div>
	`);
	const edit = createCard(`
		<h3>Edit Profile</h3>
		<div class="form">
			<div class="field"><label>Name</label><input id="pfName" value="${profile.name || ''}" /></div>
			<div class="field"><label>Role</label><input id="pfRole" value="${profile.role || ''}" /></div>
			<div class="field"><label>Skills (comma-separated)</label><input id="pfSkills" value="${(profile.skills || []).join(', ')}" /></div>
			<div class="form-actions"><button id="pfSave" class="btn primary">Save</button></div>
		</div>
	`);
	root.appendChild(card); root.appendChild(edit);
	document.getElementById('pfSave').onclick = () => {
		const name = document.getElementById('pfName').value.trim();
		const role = document.getElementById('pfRole').value.trim();
		const skills = document.getElementById('pfSkills').value.split(',').map(s => s.trim()).filter(Boolean);
		Store.Actions.updateProfile({ name, role, skills });
		onRouteChange();
	};
}

/* Resume Builder */
function renderResumeBuilder(root) {
	const layout = document.createElement('div');
	layout.style.display = 'grid'; layout.style.gridTemplateColumns = '1fr 1fr'; layout.style.gap = '16px';
	const { resume } = Store.getState();

	const formCard = createCard(`
		<h3>Resume Builder</h3>
		<div class="form">
			<div class="field"><label>Name</label><input id="rsName" value="${resume.name || ''}" placeholder="Your name" /></div>
			<div class="field"><label>Education</label><textarea id="rsEdu" rows="3" placeholder="Degree, University, Year">${resume.education || ''}</textarea></div>
			<div class="field"><label>Experience</label><textarea id="rsExp" rows="4" placeholder="Company, Role, Dates, Impact">${resume.experience || ''}</textarea></div>
			<div class="field"><label>Skills</label><input id="rsSkills" value="${resume.skills || ''}" placeholder="e.g. Python, SQL, AWS" /></div>
			<div class="field"><label>Projects</label><textarea id="rsProj" rows="3" placeholder="Project, Tech, Outcome">${resume.projects || ''}</textarea></div>
			<div class="form-actions">
				<button id="rsSave" class="btn primary">Save</button>
			</div>
		</div>
	`);
	const preview = createCard(`
		<h3>ATS Preview</h3>
		<div style="height:520px; background:white; color:#111827; border-radius:12px; padding:16px; overflow:auto; border:1px solid #e5e7eb">
			<strong>${resume.name || 'Your Name'}</strong><br />${(Store.getState().profile.role) || 'Role'}<br /><br />
			<span style="color:#4b5563">Education</span><br />${resume.education || ''}<br /><br />
			<span style="color:#4b5563">Experience</span><br />${resume.experience || ''}<br /><br />
			<span style="color:#4b5563">Skills</span><br />${resume.skills || ''}<br /><br />
			<span style="color:#4b5563">Projects</span><br />${resume.projects || ''}
		</div>
	`);
	layout.appendChild(formCard); layout.appendChild(preview); root.appendChild(layout);

	document.getElementById('rsSave').onclick = () => {
		Store.Actions.saveResume({
			name: document.getElementById('rsName').value,
			education: document.getElementById('rsEdu').value,
			experience: document.getElementById('rsExp').value,
			skills: document.getElementById('rsSkills').value,
			projects: document.getElementById('rsProj').value,
		});
		alert('Saved');
		onRouteChange();
	};
}

/* Not Found */
function renderNotFound(root) { root.innerHTML = `<div class="card"><h3>Page not found</h3><p>The page you requested does not exist.</p></div>`; }