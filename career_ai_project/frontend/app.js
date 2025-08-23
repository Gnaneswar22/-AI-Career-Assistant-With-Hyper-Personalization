/* Simple SPA Router */
const routes = {
	"/": renderLanding,
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

function navigate(path) {
	window.location.hash = `#${path}`;
}

function getPath() {
	const hash = window.location.hash || "#/";
	const path = hash.replace(/^#/, "");
	return path;
}

function onRouteChange() {
	const path = getPath();
	const view = document.getElementById("view");
	const renderer = routes[path] || renderNotFound;
	view.innerHTML = "";
	renderer(view);
	setActiveLink(path);
}

function setActiveLink(path) {
	document.querySelectorAll('.nav-link').forEach((link) => {
		if (link.getAttribute('href') === `#${path}`) link.classList.add('active');
		else link.classList.remove('active');
	});
}

window.addEventListener('hashchange', onRouteChange);
window.addEventListener('DOMContentLoaded', onRouteChange);

/* Shared UI builders */
function createCard(html) {
	const el = document.createElement('div');
	el.className = 'card';
	el.innerHTML = html;
	return el;
}

function progressBar(percent) {
	return `<div class="progress"><span style="width:${percent}%"></span></div>`;
}

/* Landing */
function renderLanding(root) {
	root.innerHTML = `
		<section class="landing">
			<div class="landing-hero">
				<h1>Your Hyper-Personalized Career GPS</h1>
				<p>Plan roadmaps, learn courses, build projects, and land jobs with AI guidance.</p>
				<div class="cta-buttons">
					<a class="btn primary" href="#/dashboard">Login</a>
					<a class="btn secondary" href="#/dashboard">Sign Up</a>
				</div>
			</div>
		</section>
	`;
}

/* Dashboard */
function renderDashboard(root) {
	const section1 = document.createElement('section');
	section1.className = 'section';
	section1.innerHTML = `<h2>Adaptive Roadmaps</h2>`;
	const roadmapsRow = document.createElement('div');
	roadmapsRow.className = 'row-scroll';
	[
		{ title: 'Data Science', progress: 35 },
		{ title: 'Full Stack', progress: 62 },
		{ title: 'AI/ML', progress: 18 },
		{ title: 'Cloud', progress: 48 },
	].forEach(({ title, progress }) => {
		roadmapsRow.appendChild(createCard(`
			<h3>${title}</h3>
			<p>Personalized steps to master ${title}.</p>
			${progressBar(progress)}
		`));
	});
	section1.appendChild(roadmapsRow);

	const section2 = document.createElement('section');
	section2.className = 'section';
	section2.innerHTML = `<h2>Courses</h2>`;
	const coursesGrid = document.createElement('div');
	coursesGrid.className = 'grid courses';
	['GenAI with Google', 'AWS Cloud Practitioner', 'CS50x', 'DeepLearning.ai'].forEach((c) => {
		coursesGrid.appendChild(createCard(`
			<h3>${c}</h3>
			<p>Curated learning path for ${c}.</p>
			<div class="badge muted">Not Started</div>
			<div class="row">
				<button class="btn secondary" onclick="navigate('/courses')">View</button>
			</div>
		`));
	});
	section2.appendChild(coursesGrid);

	const section3 = document.createElement('section');
	section3.className = 'section';
	section3.innerHTML = `<h2>Quick Actions</h2>`;
	const actions = document.createElement('div');
	actions.className = 'row';
	[
		{ label: 'Build Resume', to: '/resume' },
		{ label: 'Start Project', to: '/projects' },
		{ label: 'Find Jobs', to: '/jobs' },
	].forEach(({ label, to }) => {
		const btn = document.createElement('a');
		btn.className = 'btn primary';
		btn.href = `#${to}`;
		btn.textContent = label;
		actions.appendChild(btn);
	});
	section3.appendChild(actions);

	root.appendChild(section1);
	root.appendChild(section2);
	root.appendChild(section3);
}

/* Roadmaps */
function renderRoadmaps(root) {
	root.innerHTML = `<h2>Adaptive Roadmaps</h2>`;
	const row = document.createElement('div');
	row.className = 'row-scroll';
	[
		{ title: 'Data Science', desc: 'From Python to deployment', progress: 40 },
		{ title: 'Full Stack', desc: 'Frontend, backend, and DevOps', progress: 60 },
		{ title: 'AI/ML', desc: 'ML fundamentals to MLOps', progress: 20 },
		{ title: 'Cloud', desc: 'AWS/Azure cloud mastery', progress: 55 },
	].forEach(({ title, desc, progress }) => {
		row.appendChild(createCard(`
			<h3>${title}</h3>
			<p>${desc}</p>
			${progressBar(progress)}
			<div class="row" style="margin-top:10px">
				<a class="btn secondary" href="#/roadmaps">View</a>
			</div>
		`));
	});
	root.appendChild(row);
}

/* Courses */
function renderCourses(root) {
	root.innerHTML = `<h2>Courses</h2>`;
	const grid = document.createElement('div');
	grid.className = 'grid courses';
	[
		{ title: 'Machine Learning Specialization', provider: 'Coursera', status: 'In Progress' },
		{ title: 'AWS Cloud Practitioner', provider: 'AWS', status: 'Not Started' },
		{ title: 'Google Data Analytics', provider: 'Google', status: 'Completed' },
		{ title: 'System Design Primer', provider: 'Educative', status: 'Not Started' },
	].forEach(({ title, provider, status }) => {
		const statusClass = status === 'Completed' ? 'success' : status === 'In Progress' ? 'warning' : 'muted';
		grid.appendChild(createCard(`
			<h3>${title}</h3>
			<p>Provider: ${provider}</p>
			<div class="badge ${statusClass}">${status}</div>
			<div class="row" style="margin-top:10px">
				<a class="btn secondary" href="#/courses">Start Course</a>
			</div>
		`));
	});
	root.appendChild(grid);
}

/* Projects */
function renderProjects(root) {
	const s1 = document.createElement('section');
	s1.className = 'section';
	s1.innerHTML = `<h2>Suggested Projects</h2>`;
	const sg = document.createElement('div');
	sg.className = 'grid projects';
	['AI Study Planner', 'Job Match Recommender', 'Resume ATS Scanner', 'Cloud Cost Tracker'].forEach((p) => {
		sg.appendChild(createCard(`
			<h3>${p}</h3>
			<p>AI-suggested idea to build and showcase.</p>
			<div class="row"><a class="btn primary" href="#/projects">Start Project</a></div>
		`));
	});
	s1.appendChild(sg);

	const s2 = document.createElement('section');
	s2.className = 'section';
	s2.innerHTML = `<h2>Completed Projects</h2>`;
	s2.appendChild(createCard(`
		<h3>Portfolio Website</h3>
		<p>Linked to GitHub</p>
		<div class="row"><a class="btn secondary" href="#/projects">Upload Project</a></div>
	`));

	root.appendChild(s1);
	root.appendChild(s2);
}

/* Jobs */
function renderJobs(root) {
	root.innerHTML = `<h2>Jobs</h2>`;
	const g = document.createElement('div');
	g.className = 'grid';
	[
		{ title: 'Data Scientist', company: 'Acme Corp', match: 86 },
		{ title: 'Full Stack Engineer', company: 'Techify', match: 74 },
		{ title: 'ML Engineer', company: 'VisionAI', match: 67 },
	].forEach((j) => {
		g.appendChild(createCard(`
			<div class="space-between">
				<div>
					<h3>${j.title}</h3>
					<p>${j.company}</p>
				</div>
				<div class="badge">Match ${j.match}%</div>
			</div>
			<div class="row" style="margin-top:10px"><a class="btn primary" href="#/jobs">Apply</a></div>
		`));
	});
	root.appendChild(g);

	const filter = document.createElement('aside');
	filter.className = 'card';
	filter.style.marginTop = '16px';
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

/* Mentor (Chatbot) */
function renderMentor(root) {
	root.innerHTML = `<h2>AI Mentor</h2>`;
	const chat = document.createElement('div');
	chat.className = 'card';
	chat.innerHTML = `
		<div style="height:300px; overflow:auto; display:grid; gap:8px">
			<div class="badge">Mentor: How can I help you today?</div>
		</div>
		<div class="row" style="margin-top:10px">
			<input id="mentorInput" style="flex:1" placeholder="Ask the AI mentor..." />
			<button class="btn primary">Send</button>
			<a class="btn secondary" href="#/resume">Generate Resume</a>
			<a class="btn secondary" href="#/roadmaps">View Roadmap</a>
			<a class="btn secondary" href="#/projects">Suggest Project</a>
		</div>
	`;
	root.appendChild(chat);
}

/* Community */
function renderCommunity(root) {
	const s1 = document.createElement('section');
	s1.className = 'section';
	s1.innerHTML = `<h2>Community</h2>`;
	const forums = document.createElement('div');
	forums.className = 'grid';
	['Roadmaps', 'Courses', 'Projects', 'Jobs'].forEach((cat) => {
		forums.appendChild(createCard(`
			<h3>${cat}</h3>
			<p>Discuss and share insights.</p>
			<div class="row"><span class="badge">42 posts</span></div>
		`));
	});
	s1.appendChild(forums);

	const s2 = document.createElement('section');
	s2.className = 'section';
	s2.innerHTML = `<h2>Leaderboard</h2>`;
	s2.appendChild(createCard(`
		<div class="row"><span class="badge">XP: 1240</span><span class="badge">Badges: 5</span><span class="badge">Streak: 7</span></div>
	`));

	root.appendChild(s1);
	root.appendChild(s2);
}

/* Profile */
function renderProfile(root) {
	const card = createCard(`
		<div class="row" style="gap:16px">
			<div style="width:64px; height:64px; border-radius:50%; background: rgba(255,255,255,0.15);"></div>
			<div>
				<h3>Alex Doe</h3>
				<p>Data Science Enthusiast • Python, SQL, ML</p>
			</div>
		</div>
	`);

	const tabs = createCard(`
		<div class="row">
			<a class="btn secondary" href="#/roadmaps">Roadmaps</a>
			<a class="btn secondary" href="#/courses">Courses</a>
			<a class="btn secondary" href="#/projects">Projects</a>
			<a class="btn secondary" href="#/resume">Resume</a>
			<a class="btn secondary" href="#/jobs">Job Matches</a>
		</div>
	`);

	const chart = createCard(`<h3>Skill Graph</h3><div style="height:240px; background: rgba(255,255,255,0.06); border-radius:12px;"></div>`);

	root.appendChild(card);
	root.appendChild(tabs);
	root.appendChild(chart);
}

/* Resume Builder */
function renderResumeBuilder(root) {
	const layout = document.createElement('div');
	layout.style.display = 'grid';
	layout.style.gridTemplateColumns = '1fr 1fr';
	layout.style.gap = '16px';

	const formCard = createCard(`
		<h3>Resume Builder</h3>
		<div class="form">
			<div class="field"><label>Name</label><input placeholder="Your name" /></div>
			<div class="field"><label>Education</label><textarea rows="3" placeholder="Degree, University, Year"></textarea></div>
			<div class="field"><label>Experience</label><textarea rows="4" placeholder="Company, Role, Dates, Impact"></textarea></div>
			<div class="field"><label>Skills</label><input placeholder="e.g. Python, SQL, AWS" /></div>
			<div class="field"><label>Projects</label><textarea rows="3" placeholder="Project, Tech, Outcome"></textarea></div>
			<div class="form-actions">
				<button class="btn primary">Download PDF</button>
				<button class="btn secondary">Save</button>
				<button class="btn secondary" onclick="navigate('/profile')">Update from Profile</button>
			</div>
		</div>
	`);

	const preview = createCard(`
		<h3>ATS Preview</h3>
		<div style="height:520px; background:white; color:#111827; border-radius:12px; padding:16px; overflow:auto">
			<strong>Alex Doe</strong><br />Data Scientist<br /><br />
			<span style="color:#4b5563">Education</span><br />B.Sc. in Computer Science, 2023<br /><br />
			<span style="color:#4b5563">Experience</span><br />Acme Corp — ML Intern, built churn model (AUC 0.87)
		</div>
	`);

	layout.appendChild(formCard);
	layout.appendChild(preview);
	root.appendChild(layout);
}

/* Not Found */
function renderNotFound(root) {
	root.innerHTML = `<div class="card"><h3>Page not found</h3><p>The page you requested does not exist.</p></div>`;
}