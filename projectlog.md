22/04/2025
-- Project ideation and initial research after reviewing module materials.
-- Sent project idea email to tutor.

29/04/2025
-- Ethics checklist approved after proposal refinement.
-- Conducted research for TMA01 and created the initial project schedule.

16/06/2025
-- Completed and submitted TMA02 report.

06/07/2025
-- Initialised local Git repository for version control.

15/07/2025
-- Assessed design/planning phase as ~70% complete. Emailed tutor to request an extension for the implementation sprint.

22/07/2025
-- Began practical implementation. Set up base Django project and installed initial dependencies.

29/07/2025
-- Intensive Coding Sprint:
-- Configured Django project settings, middleware, and authentication backends.
-- Implemented the complete GraphQL schema with full CRUD operations for all core models.
-- Initialized the React frontend project using Vite and configured Tailwind CSS.
-- Built and tested frontend UI for user registration and login.

30/07/2025
-- Continued frontend development.
-- Built the main dashboard UI to fetch and display projects and clients from the backend API.
-- Implemented the modal form to create new projects.

01/08/2025
-- Fixed critical workflow flaw by adding an inline "Add Client" feature to the project creation modal.
-- Focused on creating visual charts etc for the report. Completed the Entity-Relationship Diagram (ERD).

02/08/2025
-- Completed the User Authentication Flowchart.
-- Wrote the final draft of the Project Work and Reflection sections of the TMA03 report.
-- Assembled all appendices and performed final review.

05/08/2025
-- Finalised and submitted TMA03 report, including all diagrams, appendices, and evidence of the functional core application.

24/08/2025
-- Reviewed TMA03 feedback and created a plan to meet all the criteria, and reach a final endpoint and completion for the project
-- Begin final Coding session to complete the application side.

-- Development:
--- Implemented Global Authentication, using react context, created a ProtectedRoute to ensure only authorised users can access the dashboard
--- Create a landing page
--- Had to reset repository as icloud drive did not sync my first 2 commits
--- If user is already logged in and try to access register or login page force them to the dashboard
--- Implement Update Project Functionality

29/08/2025
-- Change Home Page Buttons to access dashboard when the user is logged in, rather than login buttons
-- Implement the Delete Project Functionality

30/08/2025
-- Create Dahsboard Layout, Implement Side Navigation and top navigation, as Well as active nav link states for a more intuitive user Experience
-- Create Clients List Page, with a separate create client modal, and delete functionality.
-- Create Project Details Page
-- Extend existing Task Model with more fields to be more fit for purpose
-- Task Management CRUD interface (Create/edit Modal,), on the Project Details Page

31/08/2025
-- Implement Delete Button for tasks
-- Fix edit tasks

01/09/2025
-- Create Landing Page Navbar, and Dashboard Navbar
-- Incorporate User Information into navbar
-- Create a settings page to view user information and change password
-- Adjust architecture to use email as the username, and register users with first name and last name
-- Complete Dashboard Overview page

02/09/2025
-- Implement Stripe invoicing using stripes sandbox environment, creates an invoice for a project based on its tasks
-- Fix graphql submission bugs
-- Fix create client inside create project, to deny invalid email addresses
-- Extend Invoice system to store the invoice url, and allow the invoice to be viewed again.
--add logic to mark Invoice as paid, and store amount_paid
--Implement logic to void old invoice if a previous invoice had bene generated

03/09/2025
-- Extend tasks, to have a include on invoice field, and a price to be charged field to ensure a more complete experience
--Optimise navigation for mobile, converting the sidebar on mobile to a sliding drawer, while retaining the desktop functionality
-- Refactor project ready for end of development stage
-- Implement a Toast system, replacing all alerts

05/09/2025
-- Mark End of Development Side
-- Start work on creating the production environment
-- Create a base install.md file, nginx.conf file and .env.example

07/09/2025
-- Link graphiql to DEBUG status
-- adapt django code to work with the provided environment variables
-- add postgress python plugin
-- allow the option to not use postgress
-- create seperate nginx config files for docker and host install for simplicity
--

09/09/2025
-- Commit Production files
-- Add gunicorn to requirements.txt
-- Create a base Readme.md file
-- Adjust subtle texts
-- Test Docker integration

-- Test Host installation

###Points for document
-invoice pricing and wether it should be billed or not fields on tasks
-Stripe invoice shows name ou Freelancer pms (ou included for personal reference on stripes system)
-Modals can be streamlined animations, single files, DRY, dissmissable backdrop

-- make a single form componenet and pass list
-- dashboard tasks page not implemented
-- invoice sent count on dashboard overview
--Timelog model not used or implemented anywhere
