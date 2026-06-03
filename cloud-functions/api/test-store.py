"""Test: context.agent.store full AgentMemory capabilities."""
from http.server import BaseHTTPRequestHandler
import json
import traceback


class handler(BaseHTTPRequestHandler):

    def do_GET(self):
        result = {
            "has_store": False,
            "tests": {},
            "error": None,
        }

        if not hasattr(self, 'context') or not hasattr(self.context, 'agent'):
            result["error"] = "no context.agent"
            self._respond(result)
            return

        store = self.context.agent.store
        result["has_store"] = store is not None

        try:
            # 1. 消息历史 CRUD
            msg_id = store.append_message("test-conv", "user", "Hello from cloud function!")
            result["tests"]["append_message"] = msg_id

            messages = store.get_messages("test-conv")
            result["tests"]["get_messages_count"] = len(messages) if messages else 0

            # 2. 格式转换
            openai_fmt = store.to_openai_input(messages)
            result["tests"]["to_openai_input"] = openai_fmt[-1] if openai_fmt else None

            # 3. 会话管理
            conv = store.get_conversation("test-conv")
            result["tests"]["get_conversation"] = conv.to_dict() if conv and hasattr(conv, 'to_dict') else str(conv)

            # 4. 框架 adapters 是否存在
            result["tests"]["has_langgraph_checkpointer"] = store.langgraph_checkpointer is not None
            result["tests"]["has_langgraph_store"] = store.langgraph_store is not None

            session = store.openai_session("test-conv")
            result["tests"]["has_openai_session"] = session is not None

            claude_store = store.claude_session_store()
            result["tests"]["has_claude_session_store"] = claude_store is not None

            # 5. Raw KV
            store.set("raw-key", "raw-value")
            result["tests"]["raw_get"] = store.get("raw-key")

        except Exception as e:
            result["error"] = f"{type(e).__name__}: {e}\n{traceback.format_exc()}"

        self._respond(result)

    def _respond(self, data):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data, indent=2, default=str).encode())
