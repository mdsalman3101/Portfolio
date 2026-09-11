-- Optional starter content. Run after schema.sql in Supabase SQL Editor.
insert into public.site_content (key,value) values
('hero','{"eyebrow":"Hey, I am Salman","headline":"CREATIVE DEVELOPER","description":"B.Tech CSE student crafting responsive web experiences where clean code, thoughtful motion and human-centered design meet."}'::jsonb),
('about','{"text":"I’m a Computer Science Engineering student at Ganpat University who enjoys turning ideas into fast, approachable web experiences. I work across frontend interfaces, APIs and databases—and keep learning by building."}'::jsonb),
('contact','{"email":"mdsalman181931@gmail.com","github":"https://github.com/mdsalman3101","linkedin":"https://www.linkedin.com/in/md-salman-982393389/"}'::jsonb)
on conflict (key) do update set value=excluded.value;

insert into public.projects(title,slug,summary,tags,live_url,github_url,featured,published,sort_order) values
('WeatherGPT','weathergpt','A featured weather experience designed for intelligent, conversational forecasts.',array['React','JavaScript','API'],null,null,true,true,0),
('E-Commerce Website','e-commerce','A responsive shopping experience with product browsing, cart and checkout functionality.',array['HTML','CSS','JavaScript'],'https://mdsalman3101.github.io/E-Commerce/','https://github.com/mdsalman3101/E-Commerce',false,true,1),
('CyberSafe','cybersafe','A web project focused on practical cyber-safety awareness and accessible security guidance.',array['HTML','CSS','JavaScript'],'https://mdsalman3101.github.io/CyberSafe/','https://github.com/mdsalman3101/CyberSafe',false,true,2),
('Task Manager','task-manager','A focused task-management experience for organizing everyday work.',array['JavaScript','HTML','CSS'],null,'https://github.com/mdsalman3101/TaskMangers',false,true,3)
on conflict (slug) do nothing;
