"""
LangGraph Stateful Graph in Cloud Function — 完整示例

用法：
  POST /api/chat
  Body: {"message": "你好", "conversation_id": "optional-custom-id"}

  多轮对话时复用同一个 conversation_id，LangGraph 自动恢复之前的 state。
"""
from http.server import BaseHTTPRequestHandler
import json

from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langchain_openai import ChatOpenAI
from typing import Annotated
from typing_extensions import TypedDict


# ─── 定义 Graph State ───

class ChatState(TypedDict):
    messages: Annotated[list, add_messages]


# ─── 定义 Graph Nodes ───

def chatbot(state: ChatState):
    """调用 LLM 生成回复"""
    llm = ChatOpenAI(
        model="gpt-4o-mini",
        base_url=__import__('os').environ.get("AI_GATEWAY_BASE_URL"),
        api_key=__import__('os').environ.get("AI_GATEWAY_API_KEY"),
    )
    response = llm.invoke(state["messages"])
    return {"messages": [response]}


# ─── 构建 Graph（模块级别，只构建一次） ───

graph_builder = StateGraph(ChatState)
graph_builder.add_node("chatbot", chatbot)
graph_builder.add_edge(START, "chatbot")
graph_builder.add_edge("chatbot", END)


# ─── Handler ───

class handler(BaseHTTPRequestHandler):

    def do_POST(self):
        # 1. 解析请求
        content_length = int(self.headers.get('Content-Length', 0))
        body = json.loads(self.rfile.read(content_length)) if content_length else {}

        user_message = body.get("message", "")
        if not user_message:
            self._respond(400, {"error": "message is required"})
            return

        # 2. 获取 store 和 conversation_id
        store = self.context.agent.store
        conversation_id = body.get("conversation_id") or self.context.agent.conversation_id

        # 3. 用 store 提供的 checkpointer 编译 graph（带状态持久化）
        checkpointer = store.langgraph_checkpointer
        graph = graph_builder.compile(checkpointer=checkpointer)

        # 4. 执行 graph（thread_id = conversation_id，LangGraph 自动恢复/保存 state）
        import asyncio
        result = asyncio.run(
            graph.ainvoke(
                {"messages": [{"role": "user", "content": user_message}]},
                config={"configurable": {"thread_id": conversation_id}},
            )
        )

        # 5. 提取最后一条 assistant 消息
        last_message = result["messages"][-1]
        reply = last_message.content if hasattr(last_message, 'content') else str(last_message)

        # 6. 返回响应
        self._respond(200, {
            "reply": reply,
            "conversation_id": conversation_id,
            "message_count": len(result["messages"]),
        })

    def _respond(self, status, data):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        # 写回 conversation_id 供客户端下次传入
        if isinstance(data, dict) and "conversation_id" in data:
            self.send_header('makers-conversation-id', data["conversation_id"])
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode())
