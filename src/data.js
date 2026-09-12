export const fallbackProjects = [
  { id:'weather', title:'WeatherGPT', slug:'weathergpt', category:'AI · WEATHER · PRODUCT', summary:'A featured weather experience designed for intelligent, conversational forecasts. Project media can be published from the admin dashboard.', tags:['React','JavaScript','API'], featured:true, published:true, sort_order:0 },
  { id:'ecommerce', title:'E-Commerce Website', slug:'e-commerce', category:'WEB · COMMERCE', summary:'A responsive shopping experience with product browsing, cart and checkout functionality.', tags:['HTML','CSS','JavaScript'], github_url:'https://github.com/mdsalman3101/E-Commerce', live_url:'https://mdsalman3101.github.io/E-Commerce/', published:true, sort_order:1 },
  { id:'cybersafe', title:'CyberSafe', slug:'cybersafe', category:'SECURITY · WEB', summary:'A web project focused on practical cyber-safety awareness and accessible security guidance.', tags:['HTML','CSS','JavaScript'], github_url:'https://github.com/mdsalman3101/CyberSafe', live_url:'https://mdsalman3101.github.io/CyberSafe/', published:true, sort_order:2 },
  { id:'tasks', title:'Task Manager', slug:'task-manager', category:'PRODUCTIVITY · WEB', summary:'A focused task-management experience for organizing everyday work.', tags:['JavaScript','HTML','CSS'], github_url:'https://github.com/mdsalman3101/TaskMangers', published:true, sort_order:3 }
]

export const fallbackCertificates = [
 ['Advanced Diploma in Computer Applications','ADCA','ADCA.pdf'],['Cisco Certificate','Cisco','cisco_certificate.pdf'],['IBM C Certification','IBM','IBMCLa_certificate.pdf'],['IBM C++ Certification','IBM','IBMCPP_certificate.pdf'],['Red Hat Certification','Red Hat','RedHat_certificate.pdf'],['Simplilearn SkillUp','Simplilearn','SimpliLeranSkillUp.pdf'],['Skill India Program','Skill India','Skillindia.pdf'],['SmartED Certification','SmartED','SmartEdCertificate.pdf'],['SmartED Internship','SmartED','SmartEdIntership_certificate.pdf'],['Semester Grade Record','Ganpat University','smmesterGread.pdf']
].map(([title,issuer,file],i)=>({id:file,title,issuer,pdf_path:`${import.meta.env.BASE_URL}assets/certificates/${file}`,published:true,sort_order:i}))

export const defaults = {
 hero:{ eyebrow:'Hey, I am Salman', headline:'CREATIVE DEVELOPER', description:'B.Tech CSE student crafting responsive web experiences where clean code, thoughtful motion and human-centered design meet.' },
 about:{ text:'I’m a Computer Science Engineering student at Ganpat University who enjoys turning ideas into fast, approachable web experiences. I work across frontend interfaces, APIs and databases—and keep learning by building.' },
 contact:{ email:'mdsalman181931@gmail.com', github:'https://github.com/mdsalman3101', linkedin:'https://www.linkedin.com/in/md-salman-982393389/' }
}

