# Group Repository for COMP SCI 2207/7207 Web & Database Computing Web Application Project (2023 Semester 1)

Your group's shared repository for the WDC 2023 Web App Project.

Auto commit/push/sync to Github is disabled by default in this repository.
- Enable the GitDoc extension to use this fucntionality (either in your VSCode settings, or in the Dev Container settings)

See [HERE](https://myuni.adelaide.edu.au/courses/85266/pages/2023-web-application-group-project-specification) for the project specification.

We recommend using the 'Shared Repository Model (Branch & Pull)' to collaborate on your work in this single repostory.
- You can read more about collaborating on GitHub repositories [HERE](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests)
- When working on the same file at the same time, the 'Live Share' feature in VSCode can also help.


Project Name: [Survival]

GitHub Link: [https://github.com/UAdelaide/23S1_WDC_UG025_survival.git]

Overview:
In this README file, you will find detailed information and guidelines on how to run the project. This includes implementation instructions, database architecture and queries, final database backup/dump, and other relevant information.

1.Database Architecture and Queries:

We use a database called "survival" (USE survival;).

There are a total of 6 tables: activity, club, manager, user, userAct, and userClub (SHOW TABLES;).

The activity table stores activity_id, club_id, announcement_title, announcement_content, and post_time (SELECT * FROM activity;).

The club table stores club_id, club_name, and manager_id (SELECT * FROM club;).

The manager table stores user_id and club_id (SELECT * FROM manager;).

The user table stores user_id, user_name, user_password, user_email, and user_identity (SELECT * FROM user;).

The userAct table stores user_id and activity_id (SELECT * FROM userAct;).

The userClub table stores user_id and club_id (SELECT * FROM userClub;).



2.Final Database Backup/Dump:

The final database backup for the project is stored at the following location:
[23S1_WDC_UG025_survival/create.sql]


3.Running the Project:

In your development environment, follow the steps below to run the project:
1.Import the database:
    service mysql start
    mysql < create.sql
2.Install project dependencies:
    npm install
3.Start the project:
    npm start