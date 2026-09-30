export const fallbackProjects = [
  { id:'luckyfx', title:'Lucky FX Studio – Client Portfolio Website', slug:'lucky-fx-studio', summary:'A cinematic, responsive portfolio for a real video editing and motion graphics studio.', description:'A professional web presence that turns Lucky FX Studio’s creative services and visual work into a clear, high-impact client experience.', problem:'The studio needed a credible digital showcase that made its services, portfolio and creative identity immediately understandable.', built:'A responsive studio portfolio with cinematic art direction, service presentation, project showcases and clear enquiry paths.', role:'Design and frontend development', project_type:'Client', year:2026, tags:['React','Responsive Design','UX'], live_url:'https://mdsalman3101.github.io/LUCKYFX/', cover_path:'/assets/lucky-fx-homepage.png', featured:true, published:true, sort_order:0 },
  { id:'cyberguard', title:'CyberGuard', slug:'cyberguard', summary:'A practical cybersecurity interface focused on clear, approachable protection guidance.', project_type:'Academic', year:2026, tags:['Security','JavaScript','UI'], published:true, sort_order:1 },
  { id:'tasks', title:'Day Ops Task Manager', slug:'day-ops-task-manager', summary:'A focused task-management experience for organizing everyday work and priorities.', role:'Frontend development', project_type:'Personal', year:2026, tags:['JavaScript','HTML','CSS'], github_url:'https://github.com/mdsalman3101/TaskMangers', published:true, sort_order:2 },
  { id:'skypulse', title:'SkyPulse Weather App', slug:'skypulse-weather', summary:'A weather interface designed around readable forecasts and quick decision-making.', project_type:'Personal', year:2026, tags:['React','API','UX'], published:true, sort_order:3 },
  { id:'cybersafe', title:'CyberSafe', slug:'cybersafe', summary:'A web project focused on practical cyber-safety awareness and accessible security guidance.', project_type:'Personal', year:2025, tags:['HTML','CSS','JavaScript'], github_url:'https://github.com/mdsalman3101/CyberSafe', live_url:'https://mdsalman3101.github.io/CyberSafe/', published:true, sort_order:4 },
  { id:'desidukan', title:'DesiDukan E-Commerce', slug:'desidukan', summary:'A responsive shopping experience with product discovery, cart and checkout flows.', project_type:'Personal', year:2025, tags:['HTML','CSS','JavaScript'], github_url:'https://github.com/mdsalman3101/E-Commerce', live_url:'https://mdsalman3101.github.io/E-Commerce/', published:true, sort_order:5 }
]

export const fallbackSkills = [
  ['Frontend','React'],['Frontend','JavaScript'],['Frontend','HTML'],['Frontend','CSS'],
  ['Core Programming','Java'],['Core Programming','C++'],['Core Programming','DSA'],
  ['Data & Tools','MySQL'],['Data & Tools','Git'],['Data & Tools','Linux'],
  ['Currently Exploring','REST APIs'],['Currently Exploring','Database Design'],['Currently Exploring','Accessible UI']
].map(([category,name],i)=>({id:`skill-${i}`,category,name,sort_order:i,published:true}))

export const fallbackJourney = [
  {id:'edu',label:'Now',title:'B.Tech Computer Science Engineering',description:'Studying at Ganpat University, Gujarat, while building practical software and web projects.'},
  {id:'client',label:'Client work · 2026',title:'Lucky FX Studio',description:'Designed and built a professional portfolio experience for a real creative media studio.'},
  {id:'security',label:'Projects',title:'Cybersecurity and practical tools',description:'Building security-focused experiences, task tools and web products through hands-on practice.'},
  {id:'next',label:'Next',title:'Ready for meaningful work',description:'Looking for internships, thoughtful freelance projects and collaborative engineering teams.'}
]

export const fallbackCertificates = [
 ['Advanced Diploma in Computer Applications','ADCA','ADCA.pdf'],['Cisco Certificate','Cisco','cisco_certificate.pdf'],['IBM C Certification','IBM','IBMCLa_certificate.pdf'],['IBM C++ Certification','IBM','IBMCPP_certificate.pdf'],['Red Hat Certification','Red Hat','RedHat_certificate.pdf'],['Simplilearn SkillUp','Simplilearn','SimpliLeranSkillUp.pdf'],['Skill India Program','Skill India','Skillindia.pdf'],['SmartED Certification','SmartED','SmartEdCertificate.pdf'],['SmartED Internship','SmartED','SmartEdIntership_certificate.pdf']
].map(([title,issuer,file],i)=>({id:file,title,issuer,pdf_path:`/assets/certificates/${file}`,published:true,sort_order:i}))

export const defaults = {
  hero:{eyebrow:'Hello, I am Salman',headline:'Creative Developer',description:'Turning ideas into fast, thoughtful digital experiences.',availability:'Open to internships & meaningful projects'},
  about:{text:'I’m a Computer Science Engineering student at Ganpat University who enjoys turning ideas into fast, approachable web experiences. I work across frontend interfaces, APIs, databases and cybersecurity—and keep learning by building.'},
  contact:{email:'mdsalman181931@gmail.com'},
  socials:{github:'https://github.com/mdsalman3101',linkedin:'https://www.linkedin.com/in/md-salman-982393389/'}
}
