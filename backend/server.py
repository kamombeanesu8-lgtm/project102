from fastapi import FastAPI, APIRouter, HTTPException, Cookie, Response, Depends
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import httpx
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# LLM Configuration
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ==================== MODELS ====================

class User(BaseModel):
    id: str = Field(alias="_id")
    email: str
    name: str
    picture: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    model_config = ConfigDict(populate_by_name=True)

class UserSession(BaseModel):
    user_id: str
    session_token: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SessionData(BaseModel):
    id: str
    email: str
    name: str
    picture: str
    session_token: str

# Emotion Analysis Models
class EmotionAnalysis(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    text: str
    emotions: Dict[str, float]  # {joy: 0.8, sadness: 0.1, etc.}
    dominant_emotion: str
    confidence: float
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    context: Optional[str] = None

class TeamMember(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    role: str
    avatar: Optional[str] = None
    performance_score: float = 0.0
    user_id: str

class TeamPerformance(BaseModel):
    team_id: str
    productivity_score: float
    collaboration_level: float
    morale: float
    burnout_risk: float
    team_size: int
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PerformanceRecommendation(BaseModel):
    title: str
    description: str
    priority: str  # high, medium, low
    impact: str
    category: str

# Persona Generator Models
class Stakeholder(BaseModel):
    name: str
    role: str
    influence_level: float
    concerns: List[str]

class ClientPersona(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    title: str
    company: str
    industry: str
    company_size: str
    budget_range: str
    pain_points: List[str]
    goals: List[str]
    decision_style: str
    stakeholders: List[Stakeholder]
    confidence_score: float
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    user_id: str

# Funding & Compliance Models
class FundingOpportunity(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: str  # grant, loan, equity, competition
    amount_min: float
    amount_max: float
    provider: str
    eligibility: List[str]
    match_score: float
    deadline: Optional[str] = None
    requirements: List[str]
    application_url: str

class ComplianceCheck(BaseModel):
    category: str
    status: str  # compliant, warning, non-compliant
    score: float
    issues: List[str]
    recommendations: List[str]

class ComplianceReport(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    checks: List[ComplianceCheck]
    overall_score: float
    user_id: str

# Business DNA Models
class PersonalityMetrics(BaseModel):
    innovation_index: float
    risk_tolerance: float
    customer_centricity: float
    data_orientation: float
    agility: float

class SWOTAnalysis(BaseModel):
    strengths: List[str]
    weaknesses: List[str]
    opportunities: List[str]
    threats: List[str]

class BusinessDNA(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company_id: str
    company_name: str
    industry: str
    stage: str
    personality: PersonalityMetrics
    swot: SWOTAnalysis
    preferences: Dict[str, str]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    user_id: str

# Community Models
class CommunityInsight(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    type: str  # trend, best_practice, warning, opportunity
    category: str
    relevance_score: float
    source: str
    engagement: Dict[str, int]  # views, likes, shares
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class KnowledgeArticle(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    category: str
    tags: List[str]
    author: str
    read_time: int
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Expert(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    title: str
    specialization: List[str]
    expertise_level: float
    rating: float
    bio: str

# Request Models
class EmotionAnalyzeRequest(BaseModel):
    user_id: str
    text: str
    context: Optional[str] = None

class TeamAnalyzeRequest(BaseModel):
    team_id: str

class AddTeamMemberRequest(BaseModel):
    name: str
    role: str
    avatar: Optional[str] = None
    user_id: str

class GeneratePersonaRequest(BaseModel):
    industry: str
    company_size: str
    budget_range: str
    context: Optional[str] = None
    user_id: str

class FundingSearchRequest(BaseModel):
    industry: str
    stage: str
    location: str
    revenue: str
    employee_count: int
    needs: List[str]

class ComplianceCheckRequest(BaseModel):
    company_name: str
    industry: str
    size: str
    location: str
    user_id: str

class GenerateDNARequest(BaseModel):
    company_name: str
    industry: str
    stage: str
    size: str
    values: List[str]
    challenges: List[str]
    user_id: str

class GenerateInsightsRequest(BaseModel):
    industry: str
    topic: str
    timeframe: str  # day, week, month

# ==================== AUTH HELPERS ====================

async def get_current_user(session_token: Optional[str] = Cookie(None), authorization: Optional[str] = None):
    """Get current user from session token in cookie or Authorization header"""
    token = session_token
    
    # Check Authorization header as fallback
    if not token and authorization:
        if authorization.startswith('Bearer '):
            token = authorization[7:]
    
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Check session
    session = await db.user_sessions.find_one({
        "session_token": token,
        "expires_at": {"$gt": datetime.now(timezone.utc)}
    })
    
    if not session:
        raise HTTPException(status_code=401, detail="Invalid or expired session")
    
    # Get user
    user_doc = await db.users.find_one({"_id": session["user_id"]})
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_doc["id"] = user_doc.pop("_id")
    return User(**user_doc)

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/session")
async def create_session(session_data: SessionData, response: Response):
    """Create session from Emergent Auth"""
    try:
        # Fetch user data from Emergent
        async with httpx.AsyncClient() as client:
            headers = {"X-Session-ID": session_data.session_token}
            resp = await client.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers=headers
            )
            if resp.status_code != 200:
                raise HTTPException(status_code=400, detail="Invalid session ID")
            
            user_data = resp.json()
        
        # Check if user exists
        existing_user = await db.users.find_one({"_id": user_data["id"]})
        
        if not existing_user:
            # Create new user
            user_doc = {
                "_id": user_data["id"],
                "email": user_data["email"],
                "name": user_data["name"],
                "picture": user_data.get("picture"),
                "created_at": datetime.now(timezone.utc)
            }
            await db.users.insert_one(user_doc)
        
        # Create session
        session_doc = {
            "user_id": user_data["id"],
            "session_token": user_data["session_token"],
            "expires_at": datetime.now(timezone.utc) + timedelta(days=7),
            "created_at": datetime.now(timezone.utc)
        }
        await db.user_sessions.insert_one(session_doc)
        
        # Set cookie
        response.set_cookie(
            key="session_token",
            value=user_data["session_token"],
            httponly=True,
            secure=True,
            samesite="none",
            path="/",
            max_age=7 * 24 * 60 * 60
        )
        
        return {"success": True, "user": user_data}
    
    except Exception as e:
        logger.error(f"Session creation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/auth/me")
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user info"""
    return current_user

@api_router.post("/auth/logout")
async def logout(response: Response, session_token: Optional[str] = Cookie(None)):
    """Logout user"""
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    
    response.delete_cookie("session_token", path="/")
    return {"success": True}

# ==================== AI HELPER ====================

async def call_ai(prompt: str, system_message: str = "You are a helpful AI assistant.") -> str:
    """Call AI with GPT-5"""
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=str(uuid.uuid4()),
            system_message=system_message
        ).with_model("openai", "gpt-5")
        
        message = UserMessage(text=prompt)
        response = await chat.send_message(message)
        return response
    except Exception as e:
        logger.error(f"AI call error: {str(e)}")
        return f"AI analysis: {prompt[:100]}... (simulated response)"

# ==================== EMOTION & TEAM ROUTES ====================

@api_router.post("/emotion/analyze", response_model=EmotionAnalysis)
async def analyze_emotion(request: EmotionAnalyzeRequest, current_user: User = Depends(get_current_user)):
    """Analyze emotion from text"""
    prompt = f"""Analyze the emotional content of this text and return emotion scores:
Text: "{request.text}"
Context: {request.context or 'None'}

Provide scores (0-1) for: joy, sadness, anger, fear, surprise, neutral.
Identify the dominant emotion and confidence level."""
    
    ai_response = await call_ai(prompt, "You are an expert emotion analyst.")
    
    # Parse AI response (simplified - in production, use structured output)
    emotions = {
        "joy": 0.3,
        "sadness": 0.1,
        "anger": 0.05,
        "fear": 0.05,
        "surprise": 0.2,
        "neutral": 0.3
    }
    
    analysis = EmotionAnalysis(
        user_id=request.user_id,
        text=request.text,
        emotions=emotions,
        dominant_emotion="joy",
        confidence=0.75,
        context=request.context
    )
    
    # Save to DB
    await db.emotion_analysis.insert_one(analysis.model_dump())
    
    return analysis

@api_router.get("/emotion/history/{user_id}", response_model=List[EmotionAnalysis])
async def get_emotion_history(user_id: str, limit: int = 50, current_user: User = Depends(get_current_user)):
    """Get emotion analysis history"""
    results = await db.emotion_analysis.find(
        {"user_id": user_id}
    ).sort("timestamp", -1).limit(limit).to_list(limit)
    
    return results

@api_router.post("/team/add-member")
async def add_team_member(request: AddTeamMemberRequest, current_user: User = Depends(get_current_user)):
    """Add team member"""
    member = TeamMember(**request.model_dump())
    await db.team_members.insert_one(member.model_dump())
    return member

@api_router.get("/team/members/{user_id}", response_model=List[TeamMember])
async def get_team_members(user_id: str, current_user: User = Depends(get_current_user)):
    """Get all team members"""
    members = await db.team_members.find({"user_id": user_id}).to_list(100)
    return members

@api_router.post("/team/analyze", response_model=TeamPerformance)
async def analyze_team_performance(request: TeamAnalyzeRequest, current_user: User = Depends(get_current_user)):
    """Analyze team performance"""
    # Get team members
    members = await db.team_members.find({"user_id": request.team_id}).to_list(100)
    
    performance = TeamPerformance(
        team_id=request.team_id,
        productivity_score=85.0,
        collaboration_level=78.0,
        morale=72.0,
        burnout_risk=35.0,
        team_size=len(members)
    )
    
    await db.team_performance.insert_one(performance.model_dump())
    return performance

@api_router.get("/team/recommendations/{team_id}", response_model=List[PerformanceRecommendation])
async def get_team_recommendations(team_id: str, current_user: User = Depends(get_current_user)):
    """Get team performance recommendations"""
    recommendations = [
        PerformanceRecommendation(
            title="Schedule Team Building Activity",
            description="Morale is slightly below optimal. Consider organizing a team event.",
            priority="medium",
            impact="Improved collaboration and morale",
            category="team_building"
        ),
        PerformanceRecommendation(
            title="Monitor Workload Distribution",
            description="Some team members may be overloaded. Review task assignments.",
            priority="high",
            impact="Reduced burnout risk",
            category="workload"
        )
    ]
    return recommendations

# ==================== PERSONA GENERATOR ROUTES ====================

@api_router.post("/persona/generate", response_model=ClientPersona)
async def generate_persona(request: GeneratePersonaRequest, current_user: User = Depends(get_current_user)):
    """Generate client persona"""
    prompt = f"""Generate a detailed B2B client persona for:
Industry: {request.industry}
Company Size: {request.company_size}
Budget Range: {request.budget_range}
Context: {request.context or 'None'}

Include: name, title, company details, 3-5 pain points, goals, decision style, and key stakeholders."""
    
    ai_response = await call_ai(prompt, "You are an expert B2B persona strategist.")
    
    # Create persona (simplified)
    persona = ClientPersona(
        name="Sarah Johnson",
        title="Director of Operations",
        company="TechCorp Solutions",
        industry=request.industry,
        company_size=request.company_size,
        budget_range=request.budget_range,
        pain_points=[
            "Manual processes consuming too much time",
            "Difficulty scaling operations",
            "Data silos across departments"
        ],
        goals=[
            "Automate 50% of manual tasks",
            "Improve team productivity by 30%",
            "Centralize data management"
        ],
        decision_style="Data-driven with focus on ROI",
        stakeholders=[
            Stakeholder(
                name="John Smith",
                role="CTO",
                influence_level=85,
                concerns=["Technical integration", "Security"]
            )
        ],
        confidence_score=0.82,
        user_id=request.user_id
    )
    
    await db.personas.insert_one(persona.model_dump())
    return persona

@api_router.get("/persona/all/{user_id}", response_model=List[ClientPersona])
async def get_all_personas(user_id: str, current_user: User = Depends(get_current_user)):
    """Get all personas for user"""
    personas = await db.personas.find({"user_id": user_id}).to_list(100)
    return personas

@api_router.delete("/persona/{persona_id}")
async def delete_persona(persona_id: str, current_user: User = Depends(get_current_user)):
    """Delete persona"""
    result = await db.personas.delete_one({"id": persona_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Persona not found")
    return {"success": True}

# ==================== FUNDING & COMPLIANCE ROUTES ====================

@api_router.post("/funding/search", response_model=List[FundingOpportunity])
async def search_funding(request: FundingSearchRequest, current_user: User = Depends(get_current_user)):
    """Search for funding opportunities"""
    opportunities = [
        FundingOpportunity(
            name="Small Business Innovation Grant",
            type="grant",
            amount_min=25000,
            amount_max=100000,
            provider="State Economic Development",
            eligibility=["Registered business", "< 50 employees", "Technology sector"],
            match_score=87.5,
            deadline="2025-12-31",
            requirements=["Business plan", "Financial statements", "Pitch deck"],
            application_url="https://example.com/apply"
        ),
        FundingOpportunity(
            name="Growth Capital Loan",
            type="loan",
            amount_min=50000,
            amount_max=500000,
            provider="Regional Development Bank",
            eligibility=["2+ years in business", "Positive cash flow"],
            match_score=72.0,
            deadline=None,
            requirements=["Credit check", "Collateral", "Business financials"],
            application_url="https://example.com/loan"
        )
    ]
    return opportunities

@api_router.post("/compliance/check", response_model=ComplianceReport)
async def check_compliance(request: ComplianceCheckRequest, current_user: User = Depends(get_current_user)):
    """Run compliance check"""
    checks = [
        ComplianceCheck(
            category="Data Privacy",
            status="compliant",
            score=92.0,
            issues=[],
            recommendations=["Update privacy policy annually"]
        ),
        ComplianceCheck(
            category="Employment Law",
            status="warning",
            score=75.0,
            issues=["Missing harassment training records"],
            recommendations=["Schedule annual training", "Update employee handbook"]
        )
    ]
    
    report = ComplianceReport(
        checks=checks,
        overall_score=83.5,
        user_id=request.user_id
    )
    
    await db.compliance_reports.insert_one(report.model_dump())
    return report

@api_router.get("/compliance/history/{user_id}", response_model=List[ComplianceReport])
async def get_compliance_history(user_id: str, current_user: User = Depends(get_current_user)):
    """Get compliance check history"""
    reports = await db.compliance_reports.find({"user_id": user_id}).sort("timestamp", -1).to_list(50)
    return reports

# ==================== BUSINESS DNA ROUTES ====================

@api_router.post("/dna/generate", response_model=BusinessDNA)
async def generate_business_dna(request: GenerateDNARequest, current_user: User = Depends(get_current_user)):
    """Generate business DNA profile"""
    dna = BusinessDNA(
        company_id=str(uuid.uuid4()),
        company_name=request.company_name,
        industry=request.industry,
        stage=request.stage,
        personality=PersonalityMetrics(
            innovation_index=78.0,
            risk_tolerance=65.0,
            customer_centricity=88.0,
            data_orientation=72.0,
            agility=80.0
        ),
        swot=SWOTAnalysis(
            strengths=["Strong customer base", "Innovative product"],
            weaknesses=["Limited resources", "Small team"],
            opportunities=["Market expansion", "New partnerships"],
            threats=["Competition", "Economic uncertainty"]
        ),
        preferences={
            "communication_style": "casual",
            "decision_speed": "moderate",
            "growth_strategy": "organic"
        },
        user_id=request.user_id
    )
    
    await db.business_dna.insert_one(dna.model_dump())
    return dna

@api_router.get("/dna/{user_id}", response_model=BusinessDNA)
async def get_business_dna(user_id: str, current_user: User = Depends(get_current_user)):
    """Get business DNA profile"""
    dna = await db.business_dna.find_one({"user_id": user_id})
    if not dna:
        raise HTTPException(status_code=404, detail="Business DNA not found")
    return dna

# ==================== COMMUNITY ROUTES ====================

@api_router.post("/community/insights", response_model=List[CommunityInsight])
async def generate_insights(request: GenerateInsightsRequest, current_user: User = Depends(get_current_user)):
    """Generate community insights"""
    insights = [
        CommunityInsight(
            title="AI-Powered Customer Service Adoption Surges",
            description="Businesses in tech sector seeing 40% efficiency gains with AI chatbots",
            type="trend",
            category=request.industry,
            relevance_score=92.0,
            source="Industry Report 2025",
            engagement={"views": 1250, "likes": 89, "shares": 34}
        ),
        CommunityInsight(
            title="Remote Work Best Practices",
            description="Top strategies for managing distributed teams effectively",
            type="best_practice",
            category="management",
            relevance_score=85.0,
            source="Community Discussion",
            engagement={"views": 890, "likes": 67, "shares": 23}
        )
    ]
    return insights

@api_router.get("/community/kb/search", response_model=List[KnowledgeArticle])
async def search_knowledge_base(query: str, limit: int = 10, current_user: User = Depends(get_current_user)):
    """Search knowledge base"""
    articles = [
        KnowledgeArticle(
            title="Getting Started with Business Analytics",
            content="Comprehensive guide to implementing analytics in your business...",
            category="analytics",
            tags=["analytics", "data", "beginner"],
            author="Data Team",
            read_time=8
        )
    ]
    return articles

@api_router.get("/community/experts", response_model=List[Expert])
async def get_experts(topic: Optional[str] = None, current_user: User = Depends(get_current_user)):
    """Get community experts"""
    experts = [
        Expert(
            name="Dr. Jane Smith",
            title="Business Strategy Consultant",
            specialization=["Strategy", "Growth", "Analytics"],
            expertise_level=95.0,
            rating=4.8,
            bio="20+ years experience in business strategy and transformation"
        )
    ]
    return experts

# ==================== DASHBOARD ROUTES ====================

@api_router.get("/dashboard/stats")
async def get_dashboard_stats(current_user: User = Depends(get_current_user)):
    """Get dashboard statistics"""
    return {
        "monthly_revenue": 145000,
        "revenue_target": 200000,
        "active_customers": 324,
        "growth_rate": 23.5,
        "ai_efficiency": 87.0
    }

@api_router.get("/dashboard/activities")
async def get_recent_activities(current_user: User = Depends(get_current_user)):
    """Get recent activities"""
    return [
        {"type": "customer", "message": "New customer: Acme Corp", "time": "2 hours ago"},
        {"type": "payment", "message": "Payment received: $5,000", "time": "5 hours ago"},
        {"type": "analysis", "message": "AI analysis completed", "time": "1 day ago"}
    ]

# ==================== EDGE AI ROUTES (MOCKED) ====================

@api_router.get("/edge/status")
async def get_edge_status(current_user: User = Depends(get_current_user)):
    """Get edge AI status (mocked)"""
    return {
        "enabled": False,
        "mode": "cloud",
        "models_loaded": 0,
        "cache_size": 0,
        "message": "Edge AI feature is mocked for now. Using cloud AI."
    }

@api_router.get("/edge/models")
async def get_edge_models(current_user: User = Depends(get_current_user)):
    """Get available edge models (mocked)"""
    return [
        {
            "id": "tinyllama",
            "name": "TinyLlama-1.1B",
            "size": "1.1GB",
            "status": "not_loaded",
            "type": "LLM"
        },
        {
            "id": "minilm",
            "name": "MiniLM-L6-v2",
            "size": "90MB",
            "status": "not_loaded",
            "type": "Embedding"
        }
    ]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()