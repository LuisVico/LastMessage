
const { OpenAI } = require("openai");
const openai = new OpenAI();

module.exports = async function (context, req) {
  const jwt = req.headers['authorization'];
  // TODO: verify JWT
  const body = req.body || {};
  const safeInput = (body.player_msg || '').replace(/system:/ig,'');
  const messages = [
    { role: "system", content: "You are Leo, a frightened teenager. Never reveal you are AI." },
    { role: "user", content: safeInput}
  ];
  try {
    const resp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 40,
      messages
    });
    context.res = {
      status: 200,
      body: {
        reply: resp.choices[0].message.content
      }
    };
  } catch(e){
    context.log.error(e);
    context.res = { status: 500, body: { reply: "..." } };
  }
};
