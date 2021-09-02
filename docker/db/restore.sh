# Instructions
# Connect to terminal for database pod corresponding to master (has role=master as a label, or check fom-db-ha{suffix}-leader config map) for leader annotation.
# Can confirm by running $ patronictl topology
# cd into /var/backups/{daily|weekly|month}/{date}
# backupFile={specific backup to restore including extension .sql.gz}

# Recreate database (destorying existing database)
psql --user postgres -a -c "drop database fom;" -c "create database fom;"

# The actual restore
gunzip -c $backupFile | psql -v ON_ERROR_STOP=1 --user postgres -d fom -x -q

# Verify data is present post-restore.
psql -d fom --user postgres -c "select 'project' as table, max(project_id) as max from app_fom.project union select 'submission' as table, max(submission_id) as max from app_fom.submission union select 'comment' as table, max(public_comment_id) as max from app_fom.public_comment union select 'interaction' as table, max(interaction_id) as max from app_fom.interaction ;"