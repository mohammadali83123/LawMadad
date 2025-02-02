# Import necessary libraries
import warnings
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pyngrok import ngrok
from llama_index.core import (
    VectorStoreIndex,
    StorageContext,
    ServiceContext,
    load_index_from_storage,
    Document
)
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.llms.groq import Groq
import pdfplumber
import os

# Suppress warnings
warnings.filterwarnings('ignore')

# Initialize FastAPI app
app = FastAPI()

# Define the request model
class QueryRequest(BaseModel):
    query: str

# Set up NGROK for public URL
ngrok.set_auth_token("2idyB4TSJ5DSriOEMmvOWlldvLj_56Ezf1i8ZcaWQ1gXDmJvn")
public_url = ngrok.connect(8000)
print("Public URL:", public_url)

# Set up the GROQ API key
GROQ_API_KEY = "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"

# Define the context path for PDF files
input_files = [
    "civil.pdf",
    "constitution.pdf",
    "criminal.pdf",
    "family.pdf",
]

# Preprocessing function for PDF text extraction
def extract_text_from_pdf(file_path):
    text_data = []
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                text_data.append(text)
    return "\n".join(text_data)

# Load and preprocess documents
documents = []
for file in input_files:
    content = extract_text_from_pdf(file)
    documents.append(Document(text=content))

# Initialize embedding model
embed_model = HuggingFaceEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Initialize LLM (Groq with LLaMA model)
llm = Groq(model="llama-3.1-8b-instant", api_key=GROQ_API_KEY)
service_context = ServiceContext.from_defaults(embed_model=embed_model, llm=llm)

# Build and persist vector index
persist_dir = "./storage_law_app"
vector_index = VectorStoreIndex.from_documents(
    documents=documents,
    service_context=service_context,
    show_progress=True
)
vector_index.storage_context.persist(persist_dir=persist_dir)

# Define the context for legal queries
LEGAL_CONTEXT = """
Context: Provide legal guidance based on the Pakistani legal framework.
Task: Analyze the query and provide a structured response with headings and bullet points.
The format should be:
1. **Introduction/Overview**: A brief overview of the law or section.
2. **Section Description**: Explain what this section does, including its purpose and scope.
3. **Legal Provisions**: Highlight the key legal provisions or clauses under the specified section.
4. **Punishments**: Explicitly mention the punishments with references if applicable.
5. **Related Precedents**: Summarize any relevant legal precedents or landmark cases along with their results.
6. **Conclusion/Recommendations**: Conclude with advice or recommendations tailored to the query.
"""

# Endpoint for querying the model
@app.post("/query/")
async def query_model(request: QueryRequest):
    try:
        # Reload the index
        storage_context = StorageContext.from_defaults(persist_dir=persist_dir)
        index = load_index_from_storage(storage_context, service_context=service_context)
        query_engine = index.as_query_engine(service_context=service_context)

        # Append context to user query
        full_query = f"{LEGAL_CONTEXT}\n\nQuery: {request.query}"

        # Query the index
        response = query_engine.query(full_query)
        return {"response": response.response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run the server
import uvicorn

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
