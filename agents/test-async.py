"""Test: async agent with concurrent I/O and streaming."""
import asyncio
import json


async def fake_llm_stream(prompt):
    """Simulate an async LLM streaming response."""
    tokens = [f"token_{i}" for i in range(5)]
    for token in tokens:
        await asyncio.sleep(0.1)
        yield token


async def fake_db_query(key):
    """Simulate an async database lookup."""
    await asyncio.sleep(0.05)
    return {"key": key, "value": f"result-for-{key}"}


async def handler(ctx):
    """Async agent handler — demonstrates concurrent async calls + streaming."""
    body = ctx.request.body
    mode = body.get("mode", "concurrent")

    if mode == "stream":
        # Streaming mode: return SSE stream
        prompt = body.get("prompt", "hello")

        async def gen():
            yield ctx.utils.sse({"event": "start", "prompt": prompt}, event="start")
            async for token in fake_llm_stream(prompt):
                if ctx.request.is_cancelled:
                    yield ctx.utils.sse({"event": "cancelled"}, event="end")
                    return
                yield ctx.utils.sse({"token": token}, event="delta")
            yield ctx.utils.sse({"event": "done"}, event="end")

        return ctx.utils.stream_sse(gen())

    else:
        # Concurrent mode: parallel async I/O
        results = await asyncio.gather(
            fake_db_query("user-profile"),
            fake_db_query("user-settings"),
            fake_db_query("user-history"),
        )

        return {
            "message": "Async agent with concurrent I/O",
            "conversation_id": ctx.conversation_id,
            "run_id": ctx.run_id,
            "results": results,
            "async_works": True,
        }
