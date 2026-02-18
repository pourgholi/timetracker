-- ================================================
-- Reset / clean all data (safe to run multiple times)
-- ================================================

DELETE FROM time_entry;
DELETE FROM project;
DELETE FROM users;

-- Optional: reset sequences (PostgreSQL)
ALTER SEQUENCE time_entry_id_seq RESTART WITH 1;
ALTER SEQUENCE project_id_seq RESTART WITH 1;
ALTER SEQUENCE users_id_seq RESTART WITH 1;

-- ================================================
-- Seed minimal test data (optional – comment out if you don't want it)
-- ================================================

-- Test user (password = "password123" hashed with BCrypt)
INSERT INTO users (username, password, default_hourly_rate)
VALUES (
           'testuser',
           '$2a$10$3z1z1z1z1z1z1z1z1z1z1u3z1z1z1z1z1z1z1z1z1z1z1z1z1z1z1z',  -- change this hash!
           45.00
       );

-- Another user (admin)
INSERT INTO users (username, password, default_hourly_rate)
VALUES (
           'admin',
           '$2a$10$3z1z1z1z1z1z1z1z1z1z1u3z1z1z1z1z1z1z1z1z1z1z1z1z1z1z1z',  -- change this hash!
           60.00
       );

-- Example project
INSERT INTO project (name, budget_hours, budget_cost, hourly_rate)
VALUES ('Internal Tools', 200.0, 9000.00, 45.00);