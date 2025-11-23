from fastapi import FastAPI
from . import routes, models, database

app = FastAPI(title="IronBloom User Profile Backend")

# Create DB tables
models.Base.metadata.create_all(bind=database.engine)

# Include API routes
app.include_router(routes.router)
