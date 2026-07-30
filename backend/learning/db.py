import os
import uuid
from sqlalchemy import create_engine, Column, String, Float, DateTime, JSON, Date, Integer, Boolean, Text, ForeignKey, Time, Numeric, func
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from dotenv import load_dotenv

load_dotenv('../.env')

DATABASE_URL = os.environ.get('LEARNING_DATABASE_URL', 'sqlite:///./learning_local.db')

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_uuid():
    return str(uuid.uuid4())

class LearningClass(Base):
    __tablename__ = "learning_classes"
    
    id = Column(String(36), primary_key=True, default=get_uuid)
    name = Column(String, index=True)
    level = Column(Integer)
    
    subjects = relationship("LearningSubject", back_populates="learning_class")

class LearningSubject(Base):
    __tablename__ = "learning_subjects"
    
    id = Column(String(36), primary_key=True, default=get_uuid)
    class_id = Column(String(36), ForeignKey('learning_classes.id'))
    name = Column(String, index=True)
    
    learning_class = relationship("LearningClass", back_populates="subjects")
    topics = relationship("LearningTopic", back_populates="subject")

class LearningTopic(Base):
    __tablename__ = "learning_topics"
    
    id = Column(String(36), primary_key=True, default=get_uuid)
    subject_id = Column(String(36), ForeignKey('learning_subjects.id'))
    name = Column(String, index=True)
    order_idx = Column(Integer)
    lesson_config_json = Column(JSON, nullable=True)
    
    subject = relationship("LearningSubject", back_populates="topics")

class LearningEnrollment(Base):
    __tablename__ = "learning_enrollments"
    
    id = Column(String(36), primary_key=True, default=get_uuid)
    login_id = Column(String(50), index=True)
    class_id = Column(String(36), ForeignKey('learning_classes.id'))
    subject_id = Column(String(36), ForeignKey('learning_subjects.id'))
    enrolled_at = Column(DateTime, default=func.now())

class LearningStudentProgress(Base):
    __tablename__ = "learning_student_progress"
    
    id = Column(String(36), primary_key=True, default=get_uuid)
    login_id = Column(String(50), index=True)
    topic_id = Column(String(36), ForeignKey('learning_topics.id'))
    progress_percentage = Column(Float, default=0.0)
    completed = Column(Boolean, default=False)
    last_updated = Column(DateTime, default=func.now(), onupdate=func.now())
    
    topic = relationship("LearningTopic")

def init_db():
    Base.metadata.create_all(bind=engine)
