MERGE INTO users (email, name, password, role) KEY(email) VALUES ('1@1.com', 'Default User', '11111', 'STUDENT');
MERGE INTO users (email, name, password, role) KEY(email) VALUES ('admin@college.com', 'Admin User', 'admin123', 'ADMIN');
MERGE INTO club_events (id, title, event_date, location, description, seats_available) KEY(id)
VALUES (1, 'TechFest 2026', '2026-04-20', 'Main Auditorium', 'Coding challenges, demos, and startup talks.', 120);
MERGE INTO club_events (id, title, event_date, location, description, seats_available) KEY(id)
VALUES (2, 'Design Sprint Weekend', '2026-04-26', 'Innovation Lab', 'Solve campus problems with rapid prototyping.', 60);
MERGE INTO club_events (id, title, event_date, location, description, seats_available) KEY(id)
VALUES (3, 'Robotics Night', '2026-05-02', 'Block C Hall', 'Live bots, team projects, and beginner workshops.', 80);
