FROM public.ecr.aws/lambda/nodejs:14

# Copy everything that is not excluded in sibling .dockerignore file (mainly server & shared).
COPY ../../../ ${LAMBDA_TASK_ROOT}

WORKDIR ${LAMBDA_TASK_ROOT}/server

# Perform installation of node_modules dependencies.
RUN npm install

# Build server jobs project (will also build server web & shared).
RUN npm run build jobs

WORKDIR $LAMBDA_TASK_ROOT

# Document that 8080 is meant to be exposed externally via port mapping argument when running container (-p 9000:8080).
EXPOSE 8080

# Entrypoint is defined in base image (/lambda-entrypoint.sh), and takes CMD as single arg.
CMD ["server/dist/server/projects/jobs/src/job-harness.handler"]
