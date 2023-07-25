#!/bin/bash

# Warten Sie, bis der MySQL-Server erreichbar ist
until nc -z db 3306; do   
  sleep 1
done

# Führen Sie die Prisma-Befehle aus
npx prisma db push
npx prisma migrate dev --name init
