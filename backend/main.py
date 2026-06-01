from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from database import engine, Base
import models
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import SessionLocal

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TicketCreate(BaseModel):
    customer_name: str
    customer_email: str
    subject: str
    description: str

Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return {"message": "Support CRM Running Successfully"}

@app.get("/test")
def test():
    return {"status": "API Working"}

@app.post("/tickets")
def create_ticket(ticket: TicketCreate):

    db = SessionLocal()

    new_ticket = models.Ticket(
        customer_name=ticket.customer_name,
        customer_email=ticket.customer_email,
        subject=ticket.subject,
        description=ticket.description
    )

    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)

    return {
        "message": "Ticket Created",
        "id": new_ticket.id
    }

@app.get("/tickets")
def get_tickets():

    db = SessionLocal()

    tickets = db.query(models.Ticket).all()

    return tickets

@app.get("/tickets/{ticket_id}")
def get_ticket(ticket_id: int):

    db = SessionLocal()

    ticket = db.query(models.Ticket).filter(
        models.Ticket.id == ticket_id
    ).first()

    return ticket