from fastapi import FastAPI
from pydantic import BaseModel
from pyngrok import ngrok
import warnings
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

warnings.filterwarnings('ignore')

app = FastAPI()

# Define the request model
class QueryRequest(BaseModel):
    query: str

# Set up the model
GROQ_API_KEY = "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"
reader = SimpleDirectoryReader(input_files=["C:\\Users\\M ALI\\Desktop\\LawMadad\\model\\modelV2.py"])  # Update path
documents = reader.load_data()
text_splitter = SentenceSplitter(chunk_size=1024, chunk_overlap=200)
nodes = text_splitter.get_nodes_from_documents(documents, show_progress=True)
embed_model = HuggingFaceEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")
llm = Groq(model="llama-3.1-8b-instant", api_key=GROQ_API_KEY)
service_context = ServiceContext.from_defaults(embed_model=embed_model, llm=llm)
vector_index = VectorStoreIndex.from_documents(documents, show_progress=True, service_context=service_context, node_parser=nodes)
vector_index.storage_context.persist(persist_dir="./storage_mini")
storage_context = StorageContext.from_defaults(persist_dir="./storage_mini")
index = load_index_from_storage(storage_context, service_context=service_context)
query_engine = index.as_query_engine(service_context=service_context)

# Endpoint for querying the model
@app.post("/query")
async def query_model(request: QueryRequest):
    query_text = request.query
    response = query_engine.query(query_text)
    return {"response": response.response}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
