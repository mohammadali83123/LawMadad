from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import warnings
import os

warnings.filterwarnings('ignore')

# Initialize FastAPI app
app = FastAPI()

# Define the request model
class QueryRequest(BaseModel):
    query: str

# Initialize your Llama Index model and other components
from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    StorageContext,
    ServiceContext,
    load_index_from_storage
)
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core.node_parser import SentenceSplitter
from llama_index.llms.groq import Groq

# Set up the model with API Key (use an environment variable)
GROQ_API_KEY = "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"
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY environment variable is not set.")

try:
    reader = SimpleDirectoryReader(input_files=["C:\\Users\\M ALI\\Desktop\\LawMadad\\model\\constitution.pdf"])
    documents = reader.load_data()
except Exception as e:
    raise RuntimeError("Failed to load documents: " + str(e))

text_splitter = SentenceSplitter(chunk_size=1024, chunk_overlap=200)
nodes = text_splitter.get_nodes_from_documents(documents, show_progress=True)

embed_model = HuggingFaceEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")
llm = Groq(model="llama-3.1-8b-instant", api_key=GROQ_API_KEY)
service_context = ServiceContext.from_defaults(embed_model=embed_model, llm=llm)

# Persist the index
vector_index = VectorStoreIndex.from_documents(documents, show_progress=True, service_context=service_context, node_parser=nodes)
vector_index.storage_context.persist(persist_dir="./storage_mini")

# Load the index from storage
storage_context = StorageContext.from_defaults(persist_dir="./storage_mini")
index = load_index_from_storage(storage_context, service_context=service_context)
query_engine = index.as_query_engine(service_context=service_context)

# Endpoint for querying the model
@app.post("/query")
async def query_model(request: QueryRequest):
    query_text = request.query
    try:
        response = query_engine.query(query_text)
        return {"response": response.response}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Query failed: " + str(e))

# Run the server locally
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
