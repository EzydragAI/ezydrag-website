"""Ezydrag Field Notes: the blog.

Nine notes, nine looks. Same rules for all of them:
- every fact, number and quote links to a published source (listed at the end of each post);
- memes are our own drawings (blogkit.py), never borrowed images;
- simple H1/H2, one motion diagram, mid-read hooks, a TL;DR;
- no backdated publish dates. Event dates live inside the sentences.

Voices (pastiche, not quotes): the CTO's solo notes are deadpan and allergic to hype,
the CTO + COO notes are earnest, anxious and over-explained, and the design notes teach
with everyday examples, like a friendly UX explainer.
Pages are generated into src/pages/blog*.html before build.py renders the site.
"""
import json, re
from pathlib import Path
from html import escape
import blogkit as K

WRITTEN = "2026-11-09"
AUTHORS = {
    "cto": ("Shuvam Santra", "Chief Technology Officer", "shuvam-santra"),
    "coo": ("Anirban Dasgupta", "Chief Operating Officer", "anirban-dasgupta"),
    "design": ("Santanu Mondal", "Director of Design", "santanu-mondal"),
}
N8N_AGENTS = "https://blog.n8n.io/introducing-n8n-agents/"
N8N_ASSIST = "https://community.n8n.io/t/introducing-the-ai-assistant-the-workflow-building-agent-inside-n8n/302667"

def hook(t): return f'<p class="hook">{t}</p>'
def twist(t, label="Plot twist"): return f'<div class="twist" role="note"><b>{label}</b><p>{t}</p></div>'
def stat(n, suf, t): return f'<div class="bstat" role="note"><span class="stat-n tnum" data-count="{n}">{n}</span><span class="stat-s">{suf}</span><p>{t}</p></div>'
def side(t, label="Psychology corner"): return f'<div class="side" role="note"><b>{label}</b><p>{t}</p></div>'

POSTS = []
def post(**k): POSTS.append(k)

# 1 ─ terminal ─ CTO, deadpan
post(slug="n8n-assistant-asks-first", order=1, theme="terminal", authors=["cto"], tags=["n8n", "agents", "automation"],
 title="n8n's AI just learned the most underrated skill: asking first…",
 seo_title="n8n AI Assistant: why asking first matters - Ezydrag",
 desc="n8n's AI Assistant builds, tests and fixes workflows from plain English, then asks before publishing. Why that confirm button matters more than the AI.",
 tldr="n8n shipped an agent that builds workflows for you. The impressive part isn't the AI. It's that it asks before it publishes or deletes anything.",
 term=["$ n8n assistant \"build my onboarding flow\"", "> planning nodes ......... ok", "> building workflow ...... ok", "> running tests .......... ok", "> publish to production? [y/N] _"],
 fig=lambda: K.flow("How n8n's AI Assistant builds a workflow", [("Ask","Plain language"),("Plan","Picks the nodes"),("Build","Real n8n workflow"),("Test","Runs and fixes"),("Confirm","Before publish or delete")], hot=4, caption="The last step waits for a person. Credentials never go to the AI."),
 meme=lambda: K.meme_expect("The AI ships to production all by itself", "The AI asks y/N first. That's the feature.", "emails"),
 body=f"""
<h2>What happened</h2>
<p>On 9 July, n8n put an AI Assistant in preview. You describe a workflow in plain English. It plans it, builds it, tests it and fixes its own mistakes. What comes out is a normal n8n workflow. You can open it. Read it. Judge it.</p>
<p>I don't get excited about launches. It's not a mood. It's a policy. But two lines in the announcement were correct, and I respect correct.</p>
<p>One: it "asks for confirmation before high-impact actions like publishing, deleting, or other important changes." Two: "your credential and secrets are never sent to the AI."</p>
{hook("The AI is the least interesting part of this release.")}
<h2>Why you should care</h2>
<p>Every vendor now has an agent that can build things. Fine. Building is cheap. The expensive question is where the agent stops, and almost nobody answers it in the demo.</p>
<p>n8n answered it in the first post. The agent builds. A human ships. The output is something a human can read. Not "trust me."</p>
{twist("On 25 September n8n shipped Agents and made it structural: \"Mark a tool as sensitive and the agent pauses for Approve or Reject before using it.\" The confirm button stopped being a feature and became the architecture.")}
<h2>What we'd tell a founder</h2>
<ul><li><b>Write down where your agent stops.</b> Before you pick a model. One line per action: who says yes.</li>
<li><b>Make the output readable.</b> A workflow, a draft, a diff. If you can't read it, you can't approve it.</li>
<li><b>Keep secrets out of prompts.</b> The agent calls tools that hold the keys. It never sees them.</li></ul>
<h2>How we do it at Ezydrag</h2>
<p>Every agent we build has the same shape. It drafts. A named person approves anything that leaves the building. We agree that with a client before we write a line of code. It's boring. Boring is what works on a Tuesday.</p>
""",
 sources=[("Introducing the AI Assistant, n8n Community, 9 Jul 2026", N8N_ASSIST), ("Introducing n8n Agents, n8n blog, 25 Sep 2026", N8N_AGENTS)])

# 2 ─ teardown ─ design, friendly teacher
post(slug="approval-is-not-a-button", order=2, theme="teardown", authors=["design"], tags=["design", "ux", "humanintheloop"],
 title="\"Human in the loop\" is not a button. Stop shipping it like one…",
 seo_title="Designing approval for AI agents - Ezydrag",
 desc="How to design the approval moment for AI agents: what the reviewer sees, when they see it and what happens if nobody answers. From Ezydrag's design lead.",
 tldr="An \"Approve?\" button with no context trains people to click yes. Design the approval moment like a product screen, not a pop-up.",
 fig=lambda: K.compare("Two ways to ask a person", ("A button", ["\"Approve?\"", "No context", "Approve everything, forever", "Nobody knows who said yes"], False), ("An approval moment", ["What will happen, to whom", "Why the agent thinks so", "Valid for this send only", "Logged with a name and time"], True)),
 meme=lambda: K.meme_buttons("Approve", "Also approve", "Your reviewer, on the fifth \"Approve?\" pop-up of the day", "qa"),
 body=f"""
<h2>Let's start with a small experiment</h2>
<p>Think about the last cookie banner you saw. Did you read it? No. You clicked the big button. Everyone does.</p>
<p>Now imagine that banner decides whether an email goes to your biggest customer. Scary, na?</p>
<p>That's what most "human in the loop" screens look like today. One line. Two buttons. And after the fifth one, your reviewer is on autopilot.</p>
{hook("If the reviewer can't tell what happens next, the approval is decoration.")}
<h2>What the research says</h2>
<p>In July, Paul Bryant wrote a piece called "Human-in-the-Loop Is Not a Button." His point is simple: approval is a control problem, not a UI sticker. The real question is "whether the approval path is scoped, timed, routed, evidenced, and accountable."</p>
<p>He also gives a timing rule I love: ask right before the side effect. That's the moment the reviewer can see the tool, the target, the payload and the impact.</p>
{side("Ever noticed how a payment app shows the name, the amount and the account before you hit Pay? That screen exists because the moment just before an irreversible action is when people actually pay attention.", "Look around you")}
<p>In August, Margaret Mitchell, Avijit Ghosh and Samir Passi went further in a position paper titled "AI Agents Push Humans Out of the Loop." They argue that today's agent design makes real oversight harder, and that supporting the overseer should matter as much as the agent's capability.</p>
<h2>Let's tear down a good approval card</h2>
<p>Here's the anatomy. Four things, one glance:</p>
<ol class="teardown-list"><li><b>What happens.</b> "Send this email to Priya on Tuesday."</li>
<li><b>Why.</b> "Score 82. Visited pricing twice."</li>
<li><b>How far the yes goes.</b> This send only. Not every send, forever.</li>
<li><b>What if nobody answers.</b> It waits. It never "continues anyway".</li></ol>
{twist("A user study cited in Marmelab's September harness report found that writing permission rules up front blocked 20.1 points fewer bad actions than approving each action. Per-action approval works, if you design it well.")}
<h2>What I'd tell a founder</h2>
<p>Sketch the approval card before you build the agent. If you can't fill in the "why" line, the agent isn't ready yet. That's not a design problem. That's a product problem wearing a design costume.</p>
<h2>How we design it at Ezydrag</h2>
<p>Our approval cards always show the action, the reason and the name that goes into the log. You can see one in the trust section of this site. It's boring on purpose. Boring is easy to trust.</p>
""",
 sources=[("Human-in-the-Loop Is Not a Button, Digital Thought Disruption, Jul 2026", "https://digitalthoughtdisruption.com/2026/07/12/human-in-the-loop-ai-agent-approval-paths/"),
          ("AI Agents Push Humans Out of the Loop, arXiv, Aug 2026", "https://arxiv.org/abs/2608.23642"),
          ("The State of AI Harness Engineering 2026, Marmelab, Sep 2026", "https://marmelab.com/blog/2026/09/24/the-state-of-ai-harness-engineering-2026.html")])

# 3 ─ ticker ─ CTO, deadpan
post(slug="mcp-goes-stateless", order=3, theme="ticker", authors=["cto"], tags=["mcp", "agents", "infra"],
 title="MCP just deleted its sessions. Your agents will thank you…",
 seo_title="MCP 2026-07-28 spec: what stateless means for you - Ezydrag",
 desc="The Model Context Protocol's 28 July 2026 spec dropped sessions for stateless requests. What changed, why it matters for business agents, what to do next.",
 tldr="MCP went stateless. Any request can hit any server. It's plumbing news, and plumbing decides whether your agents survive production.",
 ticker=["MCP 2026-07-28 SPEC", "SESSIONS: DELETED", "HANDSHAKE: GONE", "ROUTING HEADERS: ADDED", "AUTH: HARDENED", "OLD TRANSPORT: 12-MONTH OFFRAMP"],
 fig=lambda: K.requests("MCP before and after 28 July 2026"),
 meme=lambda: K.meme_panik(["Server restarts in the middle of an agent session", "MCP is stateless now", "You still keep state in a global variable"], "ask"),
 body=f"""
<h2>What happened</h2>
<p>On 28 July, the Model Context Protocol published a new spec. MCP is how a lot of AI tools talk to other software. In the spec team's own words, MCP is "transforming from a bidirectional stateful protocol into a request/response stateless protocol."</p>
<p>That sentence will not trend. It should.</p>
{hook("The most important boring sentence of the year.")}
<p>What it means, minus the poetry:</p>
<ul><li>No more session handshake. Each request carries everything it needs.</li>
<li>Servers that need memory hand back a handle. The model passes it along.</li>
<li>New headers, so gateways can route and rate-limit without reading the body.</li>
<li>Stricter authorization. The team admits it "is where implementers spend most of their integration time." Correct.</li></ul>
<h2>Why you should care</h2>
<p>Stateful connections are adorable in a demo. In production, a server restarts, a load balancer moves you, and your agent forgets who it was talking to. Stateless means any request can hit any server. That's how normal web software has scaled for twenty years. Agents are finally being held to the same standard.</p>
{stat(12, " months", "The offramp the old HTTP+SSE transport gets before it's gone. Ask your vendors what they'll support after.")}
<h2>What we'd tell a founder</h2>
<ul><li><b>Connectors are becoming a commodity.</b> Good. Don't build your edge on plumbing.</li>
<li><b>Your edge is context and rules.</b> What your agent knows about your customers, and what it's allowed to touch.</li>
<li><b>Ask about 2027.</b> If a vendor can't answer, that's your answer.</li></ul>
<h2>How we do it at Ezydrag</h2>
<p>Every connection is a tool with one job and narrow access. Read-only first. The agent never holds the keys. That's true whatever protocol is underneath. n8n arrived at the same place in September: you pick exactly which workflows an agent can use as tools.</p>
""",
 sources=[("The 2026-07-28 Specification, MCP blog", "https://blog.modelcontextprotocol.io/posts/2026-07-28/"),
          ("Model Context Protocol prepares to break with its stateful past, The Register, Jul 2026", "https://www.theregister.com/devops/2026/07/23/model-context-protocol-prepares-to-break-with-its-stateful-past/5276722"),
          ("Introducing n8n Agents, n8n blog, Sep 2026", N8N_AGENTS)])

# 4 ─ postmortem ─ CTO + COO, earnest and anxious
post(slug="break-your-agent-on-purpose", order=4, theme="postmortem", authors=["cto", "coo"], tags=["chaosengineering", "testing", "agents"],
 title="Researchers broke every AI agent on purpose. All of them got worse…",
 seo_title="Chaos engineering for AI agents: a founder's guide - Ezydrag",
 desc="AgentChaos showed agent success can drop 50 points when APIs misbehave. How to chaos-test business agents before launch, from Ezydrag's leadership.",
 tldr="Inject one boring failure, like a timeout or an empty list, and agent success can drop by up to 50 points. Test the sad path before your customers do.",
 incident=[("Incident", "Every agent system tested got worse under injected faults"), ("Severity", "Up to −50 points of success"), ("Root cause", "How the system was built, more than which model"), ("Detected by", "AgentChaos, August 2026"), ("Status", "Preventable. That's the good news.")],
 fig=lambda: K.flow("Chaos-testing an agent before launch", [("Pick a run","A real task"),("Break one thing","Timeout, empty, wrong"),("Watch","What did it do?"),("Hand off?","Did a person get it?"),("Fix the harness","Then run again")], hot=3, caption="The test passes when a person is told. Not when the agent guesses."),
 meme=lambda: K.meme_nope("Testing only the happy path and calling it done", "Breaking it on purpose before Tuesday breaks it for you", "qa"),
 body=f"""
<h2>Timeline</h2>
<p>Okay. So. I want to walk through this carefully, because it's, honestly, kind of terrifying, and also, weirdly, great news? Let me explain.</p>
<p>In August, a research team including David Lo published AgentChaos. It's chaos engineering for AI agents. They inject faults into the API responses agents depend on (crashes, missing data, wrong values) and watch what happens. No code changes needed.</p>
<p>They ran 65 fault setups.</p>
{hook("Every single system they tested got worse.")}
{stat(50, " points", "How far success dropped, at worst, when the researchers broke one thing at a time.")}
<h2>Root cause</h2>
<p>Here's the part I keep coming back to. System rankings stayed consistent across models. Which means (and I want to be careful here) how robust your agent is depends more on how it's built than on which model you picked. The harness is the main character. Not the model. The harness.</p>
<p>And finding out what went wrong is hard. Existing diagnosis methods got the fault type right less than 53% of the time. So you can't just, you know, debug your way out later.</p>
{twist("Ten days after AgentChaos, Yintong Huo, Rangeet Pan and Abhik Roychoudhury argued for judging agents by their trajectory: every step, tool call and observation. They also shared a readiness checklist for deployment. Different paper, same conclusion.")}
<h2>Why you should care</h2>
<p>Real tools fail in boring ways. Salesforce times out. Marketo returns nothing. A field is blank. An agent that only ever saw the happy path will guess its way through those moments. Confidently. That's the word that keeps me up at night.</p>
<h2>Action items</h2>
<ul><li><b>Write the failure list first.</b> Timeouts, empty results, duplicates, missing consent.</li>
<li><b>Decide the safe move.</b> For a sales agent it's almost always: stop, and tell a person.</li>
<li><b>Budget for it.</b> Our Chief Operating Officer's rule, and he's right: if testing failures isn't in the plan, it isn't in the price.</li></ul>
<h2>How we do it at Ezydrag</h2>
<p>Before an agent touches live leads, we run it through the failure list in a test setup. A pass means it stopped and a person was told. Then we keep watching real runs, because production always finds something new. Even Salesforce now ships agent health monitoring out of the box. The whole industry is quietly admitting this is the hard part.</p>
""",
 sources=[("AgentChaos: Chaos Engineering for Agent Systems via Programmatic Fault Injection, arXiv, Aug 2026", "https://arxiv.org/abs/2608.06790"),
          ("Towards Risk-free AI Agent Deployment, arXiv, Aug 2026", "https://arxiv.org/abs/2608.16411"),
          ("21 Things We Announced at Dreamforce 2026, Salesforce", "https://www.salesforce.com/blog/dreamforce-2026-announcements/")])

# 5 ─ receipt ─ COO + CTO, earnest
post(slug="your-ai-bill-gets-a-meter", order=5, theme="receipt", authors=["coo", "cto"], tags=["pricing", "ops", "atlassian"],
 title="The free AI era is over. Your agents now have a meter…",
 seo_title="AI agent costs: credits, meters and budgets - Ezydrag",
 desc="Atlassian meters Rovo credits from 3 December 2026 and n8n bills AI in credits. How founders should budget AI agents per outcome, from Ezydrag.",
 tldr="Atlassian starts charging for extra Rovo credits on 3 December. n8n bills AI in credits. Budget per outcome, not per token, or your agent will quietly run up the card.",
 receipt=[("Extra Rovo credit", "$0.01 each"), ("Extra automation", "$0.50 / 1,000 steps"), ("Overage", "ON by default"), ("Alerts", "at 80% and 100%"), ("Missed events, if paused", "not replayed")],
 fig=lambda: K.stack("What one useful outcome really costs", [("One qualified lead, followed up","The thing you're paying for"),("Agent turns and model calls","Credits, tokens"),("Workflow steps and API calls","Automation steps"),("People time","Approvals, reviews, fixes"),("Running and improving it","Monitoring, tuning")], hot=0),
 meme=lambda: K.meme_brain(["\"AI is basically free\"", "Counting tokens", "Counting credits and steps", "Counting cost per qualified lead"], "qbr"),
 body=f"""
<h2>What happened</h2>
<p>So, I read pricing pages for fun. I know. I know. But stay with me, because this one matters.</p>
<p>On 1 September, Atlassian confirmed that from 3 December it "will enforce monthly allowances and charge for excess Rovo credits and Automation steps." Extra Rovo usage is $0.01 a credit. Extra automation is $0.50 per 1,000 steps.</p>
{hook("Overage is switched on by default. Please read that sentence twice.")}
<p>n8n was already billing its AI Assistant in credits based on tokens. Then n8n Agents gave us, honestly, the cleanest cost unit I've seen: "One turn with an agent is one execution."</p>
<h2>Why you should care</h2>
<p>For about a year, AI features felt free. They were never free. Now there's a meter, and a busy agent can run up a bill overnight while everyone is asleep, including, statistically, the person who set it up.</p>
{twist("If you turn overages off and the allowance runs out, new automations stop. And events missed during that pause aren't replayed. For a sales team, that's leads nobody follows up. Silently.", "The sneaky part")}
<h2>What we'd tell a founder</h2>
<ul><li><b>Price the outcome.</b> Cost per lead followed up, per email checked, per report drafted. Not per token.</li>
<li><b>Set caps and alerts.</b> Then decide what happens when you hit them. "Stop silently" is the worst possible answer.</li>
<li><b>Skip the model when you can.</b> A known question with an approved answer doesn't need an AI call at all.</li></ul>
<h2>How we do it at Ezydrag</h2>
<p>We estimate running costs before a pilot starts and report them per outcome afterwards. Known questions get approved answers with no model call. There's a calculator on our token efficiency page if you want to scare yourself productively.</p>
""",
 sources=[("Atlassian Will Meter Rovo and Automation Dec. 3, TechRepublic, Sep 2026", "https://techrepublic.com/article/news-atlassian-rovo-automation-pricing"),
          ("Introducing the AI Assistant, n8n Community, Jul 2026", N8N_ASSIST), ("Introducing n8n Agents, n8n blog, Sep 2026", N8N_AGENTS)])

# 6 ─ 100 seconds ─ CTO, deadpan
post(slug="agent-equals-model-plus-harness", order=6, theme="hundred", authors=["cto"], tags=["harness", "agents", "engineering"],
 title="Your agent isn't dumb. Your harness is mid…",
 seo_title="Agent harness engineering, explained simply - Ezydrag",
 desc="What an agent harness is (tools, context, memory, checks) and why it decides reliability more than the model does. A plain-English guide.",
 tldr="Agent = model + harness. Everyone shops for the model. The harness (context, tools, checks, logs) decides whether it works on a Tuesday.",
 fig=lambda: K.stack("Agent = model + harness", [("The model","Reads, reasons, writes"),("Context","Your customers, rules, history"),("Tools","Marketo, Salesforce, email: narrow access"),("Checks","Tests, evals, approvals"),("Logs and memory","Files, not just the chat window")], hot=0),
 meme=lambda: K.meme_starter("Bad harness starter pack", ["A 900-line instruction file", "Every tool switched on", "Zero evals", "\"We need a smarter model\"", "Secrets in the prompt", "Works on my machine"]),
 body=f"""
<h2 data-t="0:00">The harness, in 100 seconds</h2>
<p>An agent is a model plus a harness. Addy Osmani wrote it up for O'Reilly with Viv Trivedy's line: "Agent = Model + Harness. If you're not the model, you're the harness."</p>
<p>Lilian Weng calls a harness "the system surrounding a base model that orchestrates execution." Context. Tools. Memory. Checks. Logs. Everything that isn't the model.</p>
{hook("Your model is fine. Your model has always been fine.")}
<h2 data-t="0:30">Why it decides everything</h2>
<p>Osmani again: "A decent model with a great harness beats a great model with a bad harness."</p>
<p>When an agent misbehaves, people blame the model. Usually it's missing context, a tool with far too much access, or no check before the action. A skill issue. On the build side.</p>
{stat(60, "%", "of harnesses big enough to assess had neither a test nor an eval, in Marmelab's September study of 246 repositories.")}
{twist("Same study: only 4.4% of security rules in public CLAUDE.md files were backed by a real control. The rest were vibes, written in Markdown.", "It gets worse")}
<h2 data-t="1:00">What to do</h2>
<ul><li><b>Don't shop for models first.</b> Shop for a team that can build and run the harness.</li>
<li><b>Every mistake becomes a rule.</b> Each line in a good instruction file should trace back to something that went wrong.</li>
<li><b>Keep the rulebook short.</b> Osmani's phrase: a "pilot's checklist, not style guide."</li>
<li><b>Keep state in files.</b> Weng's advice for long-running agents: "keep durable state in files."</li></ul>
<h2 data-t="1:30">How we do it at Ezydrag</h2>
<p>Most of our build time goes into the harness, not the prompt. Context from your CRM and marketing data, tools with narrow access, approvals, logs, tests. When a better model ships, we swap it in. The harness stays. This has been the harness, in 100 seconds.</p>
""",
 sources=[("Agent Harness Engineering, Addy Osmani, O'Reilly Radar, May 2026", "https://www.oreilly.com/radar/agent-harness-engineering/"),
          ("Harness Engineering for Self-Improvement, Lilian Weng, Jul 2026", "https://lilianweng.github.io/posts/2026-07-04-harness/"),
          ("The State of AI Harness Engineering 2026, Marmelab, Sep 2026", "https://marmelab.com/blog/2026/09/24/the-state-of-ai-harness-engineering-2026.html")])

# 7 ─ quiz ─ CTO + COO, earnest
QUIZ = [("Copy every new webinar lead into Salesforce and tag the campaign.", "workflow", "You can list every step in advance. Workflow. Cheaper and easier to check."),
        ("Write the next email for a lead who opened three emails and visited pricing.", "agent", "The right email depends on what this lead just did. Agent, with an approval before it sends."),
        ("Score each lead on fit and intent using rules your sales lead agreed.", "workflow", "Agreed rules, known steps. Workflow."),
        ("Read a messy reply and decide whether it's a meeting request, an objection or an out-of-office.", "agent", "Each reply is different and the next step depends on it. Agent, with a person reviewing anything unclear.")]
post(slug="workflow-or-agent", order=7, theme="quiz", authors=["cto", "coo"], tags=["n8n", "agents", "workflows"],
 title="Workflow or agent? Stop overthinking it. Take the 2-minute test…",
 seo_title="Workflow vs AI agent: when to use which - Ezydrag",
 desc="n8n Agents made the choice explicit: fixed workflows or goal-driven agents. A simple test for founders, with four quick sales and marketing examples.",
 tldr="If you can list the steps, it's a workflow. If each step depends on the last answer, it's an agent. Most real jobs are both. Take the quiz below.",
 fig=lambda: K.tree("Workflow or agent?", "Can you list the steps in advance?", ("YES", "Use a workflow", "Enrich, score, route a lead"), ("NO", "Use an agent", "Each step depends on the last answer")),
 meme=lambda: K.meme_buttons("Build a workflow", "Build an autonomous agent", "Founders at 11pm, after one demo video", "nurture"),
 body=f"""
<h2>What happened</h2>
<p>Okay, so, every founder we talk to asks the same question, and I used to give a really long answer. Like, really long. With diagrams. Our Chief Operating Officer has asked me to stop. So here's the short version.</p>
<p>On 25 September, n8n launched Agents. You describe the job, give it a model, tools and workflows, and it figures out the steps. And they compose, which is the part I got genuinely excited about: "Every workflow you've built in n8n is something an agent can use." Mark a tool as sensitive, and the agent pauses "for Approve or Reject before using it."</p>
<p>A week earlier, Atlassian let people @mention agents inside Rovo Chat, so the agent turns up with "the thread, the decisions, and the artifacts it needs." Agents are joining the team chat. Not replacing it.</p>
{hook("Turning every if-statement into an autonomous agent is how you build a very expensive coin flip.")}
<h2>The 2-minute test</h2>
<ul><li><b>Can you list the steps in advance?</b> Workflow.</li>
<li><b>Does each step depend on the last answer?</b> Agent, with tight tools and an approval before anything leaves.</li>
<li><b>Mixed?</b> Let the workflow drive, and call the agent for the judgement step.</li></ul>
<h2>Try it: four real jobs</h2>
{{{{QUIZ}}}}
<h2>A real example from sales</h2>
<p>Capturing, enriching and scoring a lead: workflow. Writing the right next email for that specific lead: agent. Pressing send: a human. That's exactly how our Sales Nurture Agent is built, and, honestly, it took us a while to get that simple.</p>
<h2>Our Chief Operating Officer's hot take</h2>
<p>Agents choose their own path, so read their logs the way engineers read code changes. Budget the time for it. It's the cheapest insurance you'll ever buy.</p>
""",
 sources=[("Introducing n8n Agents, n8n blog, 25 Sep 2026", N8N_AGENTS),
          ("New in Rovo Chat, Atlassian, 17 Sep 2026", "https://www.atlassian.com/blog/company-news/rovo-chat-new-features-september-2026"),
          ("n8n Agents change the automation contract: from steps to goals, DEV Community", "https://dev.to/echakiri/n8n-agents-change-the-automation-contract-from-steps-to-goals-h49")])

# 8 ─ tier list ─ CTO + COO, earnest
post(slug="every-crm-has-an-sdr-agent", order=8, theme="tier", authors=["cto", "coo"], tags=["sales", "salesforce", "agents"],
 title="Every CRM now ships an SDR agent. So… what's your edge?",
 seo_title="AI SDR agents after Dreamforce 2026: what wins - Ezydrag",
 desc="After Dreamforce 2026, agents that nurture and qualify inbound leads come built into the CRM. What still sets a sales team apart, from Ezydrag's leadership.",
 tldr="Salesforce made a lead-nurture agent a standard feature. When everyone has the same agent, the edge is your rules, your content, your approvals and who runs it.",
 tiers=[("S", "What actually wins", ["Your scoring rules", "Someone who runs it daily"]), ("A", "Big deal", ["Your content and voice", "Clear approvals"]),
        ("B", "Table stakes now", ["An SDR agent in the CRM", "Health dashboards"]), ("C", "Not an edge anymore", ["\"We have AI\"", "A bigger model"])],
 fig=lambda: K.compare("Who brings what", ("What the platform brings", ["An SDR agent out of the box", "Health metrics and alerts", "Permissions you already set", "A/B tests for agents"], False), ("What you still own", ["Your scoring rules", "Your content and voice", "Who approves what", "Someone who runs it daily"], True)),
 meme=lambda: K.meme_expect("Switch on the SDR agent. Pipeline goes up.", "\"Wait, who wrote these scoring rules?\"", "nurture"),
 body=f"""
<h2>What happened</h2>
<p>Right, so, I watched the Dreamforce recap twice, and I want to be fair to it, because there's a lot of genuinely good stuff in there.</p>
<p>Salesforce's recap listed 21 announcements. The one for sales teams: Piper, now generally available, an AI sales development agent that "works around the clock to nurture your inbound prospects." It qualifies leads, books meetings and syncs everything back to the CRM.</p>
<p>Long-horizon agents went to pilot too, with goals like "re-engage my at-risk deals" running over days or weeks inside guardrails you set. General availability was listed for November. They also shipped the boring-but-important stuff: Agent Health Monitoring, and an Agent Optimizer that ranks recurring failures.</p>
{stat(55, "%", "of sales professionals already used AI for prospecting, according to Salesforce's own survey in February.")}
{hook("When everyone has the same agent, the agent stops being your advantage.")}
<h2>The tier list</h2>
<p>So we made a tier list. I'm aware a tier list is not peer-reviewed. It's still correct.</p>
{{{{TIERS}}}}
<h2>What we'd tell a founder</h2>
<ul><li><b>Own your rules.</b> Who's a good lead, what "ready" means, when to stop emailing.</li>
<li><b>Own your voice.</b> Agents write from your approved content. Thin content, thin emails.</li>
<li><b>Own the approvals.</b> Decide who signs off. Write it down.</li>
<li><b>Make someone responsible for running it.</b> A health dashboard has never fixed anything by itself. Not once.</li></ul>
<h2>How we do it at Ezydrag</h2>
<p>That last point is, um, literally our business. We build the rules, the content flow and the approvals around your CRM's agents or our own, then run them with you. Platform agents are good news for us. They make the part we do impossible to ignore.</p>
""",
 sources=[("21 Things We Announced at Dreamforce 2026, Salesforce", "https://www.salesforce.com/blog/dreamforce-2026-announcements/"),
          ("Top AI agent use cases, Salesforce State of Sales, Feb 2026 (vendor survey)", "https://www.salesforce.com/news/stories/state-of-sales-report-announcement-2026/top-ai-agent-use-cases/")])

# 9 ─ magazine ─ design, the standout
post(slug="labor-illusion-ai-agents", order=9, theme="magazine", authors=["design"], tags=["design", "psychology", "ux"],
 title="Why watching an AI work makes you trust it more (yes, it's psychology)…",
 seo_title="The labor illusion: designing trust for AI agents - Ezydrag",
 desc="Why people value services more when they can see the work: the labor illusion, operational transparency and response-time limits, applied to AI agent design.",
 tldr="People trust what they can see being done. It's called the labor illusion. Agents take minutes, not milliseconds, so show the real work, step by step. Never fake it.",
 fig=lambda: K.two_searches("Same results, two designs"),
 meme=lambda: K.meme_expect("An instant answer. Users will love it.", "\"Hmm. Did it even check anything?\"", "ask"),
 body=f"""
<h2 data-ch="01">A question for you</h2>
<p>You search for flights. One site answers instantly. Another shows you a little progress bar: checking airlines, comparing fares. Both give you the exact same results.</p>
<p>Which one do you trust more?</p>
<p>Be honest. It's the slower one, na? Don't worry. You're not weird. You're human.</p>
{hook("We trust the work we can see. Even when the result is identical.")}
<h2 data-ch="02">This is called the labor illusion</h2>
<p>In 2011, Ryan Buell and Michael Norton published a paper in Management Science called "The Labor Illusion: How Operational Transparency Increases Perceived Value." Their finding: when a website shows people it's working on their request, people value the service more, even when it takes longer.</p>
<p>Their own summary is lovely: "providing information to your customer will improve perceptions, even if total service time is higher."</p>
{side("Seeing effort feels like care. When a waiter repeats your order back, nothing gets faster. But you relax, because you can see someone understood you. Same thing.")}
<h2 data-ch="03">The pizza that taught everyone</h2>
<p>Remember the pizza tracker? According to The Hustle, Domino's launched it in 2008. It was, in their words, "essentially a progress bar." Order placed, prep, bake, quality check, out the door.</p>
<figure class="post-figure inline" data-anim>{{{{FIG:tracker}}}}</figure>
<p>The pizza didn't get faster. But waiting felt different, because you could see where your pizza was. That's the whole trick.</p>
<p>Researchers took it further. The same Hustle piece describes a cafeteria study where showing diners the kitchen raised their satisfaction, without slowing the service down. Open the kitchen window, and people like the food more.</p>
<figure class="post-figure inline" data-anim>{{{{FIG:kitchen}}}}</figure>
<h2 data-ch="04">Now add time limits</h2>
<p>Back in 1993, Jakob Nielsen described three response-time limits that still hold:</p>
<ul><li><b>0.1 seconds</b> feels instant.</li><li><b>1 second</b> keeps your flow of thought intact.</li><li><b>10 seconds</b> is about the limit for keeping attention. After that, people wander off, so you should show when the result will arrive.</li></ul>
<figure class="post-figure inline" data-anim>{{{{FIG:timescale}}}}</figure>
{twist("AI agents don't take 0.1 seconds. They take a minute. Sometimes ten. That's far past Nielsen's attention limit, on every single run. If your agent shows a spinner for three minutes, you're not designing a product. You're designing anxiety.", "Here's the problem")}
<h2 data-ch="05">So, what do we design?</h2>
<p>Three simple rules we follow at Ezydrag:</p>
<ol class="teardown-list"><li><b>Show the real steps.</b> "Checked 3 sources. Scored 82. Drafted email." Real work, in plain words.</li>
<li><b>Show what's next and who's needed.</b> If a person must approve, say so before they wonder why it stopped.</li>
<li><b>Never fake it.</b> A fake progress bar is a dark pattern. The labor illusion works because the labor is real. If there's no work to show, just be fast.</li></ol>
{hook("Show the work. Don't perform it.")}
<h2 data-ch="06">Try it yourself</h2>
<p>Here's a tiny demo. Same answer both times. Notice how each one feels.</p>
{{{{DEMO}}}}
<p>You can see this idea across our own site too. Our agent demos show every step, and the step that needs a person is always highlighted. That's not decoration. That's the labor illusion, used honestly.</p>
<h2 data-ch="07">One-line summary</h2>
<p>People don't trust magic. They trust visible, honest work. Design your agents to show it.</p>
""",
 sources=[("The Labor Illusion: How Operational Transparency Increases Perceived Value, Buell and Norton, Management Science, 2011", "https://pubsonline.informs.org/doi/abs/10.1287/mnsc.1110.1436"),
          ("How the Domino's pizza tracker conquered the business world, The Hustle, Aug 2025", "https://thehustle.co/originals/how-the-dominos-pizza-tracker-conquered-the-business-world"),
          ("Response Times: The 3 Important Limits, Jakob Nielsen, Nielsen Norman Group (1993)", "https://www.nngroup.com/articles/response-times-3-important-limits/")])

FIGS = {"tracker": lambda: K.tracker("A progress bar for pizza"), "kitchen": lambda: K.kitchen("Open the kitchen window"), "timescale": lambda: K.timescale("How long can people wait?")}
PAUSE = '<button type="button" class="fig-pause" aria-pressed="false">Pause</button>'

# ------------------------------------------------------------------ rendering
def page_name(p): return f"blog-{p['slug']}.html"
def read_min(p): return max(2, round(len(re.sub(r"<[^>]+>|\{\{.*?\}\}", " ", p["body"] + p["tldr"]).split()) / 220))
TAGTONES=["lav","mint","butter","sky","peach","rose"]
def tagline(p): return "".join(f'<span class="tag tone-{TAGTONES[sum(map(ord,t))%6]}">#{t}</span>' for t in p["tags"])
def by_row(p, h="h3"):
    """Coursera-style card: thumbnail, topic, title, then the author's face, name, role and date."""
    faces = "".join(f'<img src="assets/team/{AUTHORS[a][2]}.jpg" alt="" width="36" height="36" loading="lazy">' for a in p["authors"])
    names = " &amp; ".join(AUTHORS[a][0] for a in p["authors"])
    roles = " · ".join(AUTHORS[a][1] for a in p["authors"])
    return (f'<span class="bl-thumb"><img src="assets/blog/{p["slug"]}.png" alt="" width="1200" height="675" loading="lazy"></span>'
            f'<span class="bl-in"><span class="post-kicker">{tagline(p)}</span><{h} class="h4">{escape(p["title"])}</{h}><p>{escape(p["tldr"])}</p>'
            f'<span class="bl-auth"><span class="bl-faces">{faces}</span><span><b>{names}</b><small>{roles} · <time datetime="{WRITTEN}">{fmt_date(WRITTEN)}</time> · {read_min(p)} min read</small></span></span></span>')

def authors_line(p): return " · ".join(AUTHORS[a][0] + ", " + AUTHORS[a][1] for a in p["authors"])
def fmt_date(d):
    import datetime as _d
    x = _d.date.fromisoformat(d); return f"{x.day} {x.strftime('%b %Y')}"

def byline(p):
    names = [AUTHORS[a] for a in p["authors"]]
    imgs = "".join(f'<img src="assets/team/{f}.jpg" alt="" width="40" height="40" loading="lazy">' for _, _, f in names)
    who = " and ".join(f"<b>{n}</b>, {r}" for n, r, _ in names)
    return f'<div class="post-by"><span class="post-faces">{imgs}</span><span>{who}<small><time datetime="{WRITTEN}">{fmt_date(WRITTEN)}</time> · {read_min(p)} min read</small></span></div>'

def quiz():
    items = "".join(f'''<li class="qz" data-ans="{a}"><p class="qz-q"><span class="qz-n">{i+1}</span>{escape(q)}</p>
  <div class="qz-btns" role="group" aria-label="Question {i+1}: your answer"><button type="button" data-pick="workflow">Workflow</button><button type="button" data-pick="agent">Agent</button></div>
  <p class="qz-a" role="status" hidden><b></b> {escape(why)}</p></li>''' for i, (q, a, why) in enumerate(QUIZ))
    return f'<ol class="quiz">{items}</ol><p class="qz-score" role="status" aria-live="polite"></p>'

def tiers(p):
    return '<div class="tiers" role="list">' + "".join(f'<div class="tier t-{t.lower()}" role="listitem"><span class="tier-l">{t}</span><span class="tier-n">{escape(n)}</span><span class="tier-c">' + "".join(f'<span class="chip">{escape(c)}</span>' for c in cs) + '</span></div>' for t, n, cs in p["tiers"]) + '</div>'

def demo():
    return '''<div class="demo" data-demo>
 <div class="demo-bar"><span class="demo-q">Find the best 3 flights, Delhi to Goa, Friday</span><span class="demo-btns"><button type="button" class="btn btn-ghost btn-sm" data-run="fast">Run: instant</button><button type="button" class="btn btn-primary btn-sm" data-run="show">Run: show the work</button></span></div>
 <ol class="demo-steps" aria-live="polite"></ol>
 <ul class="demo-res" hidden><li>06:10 · 2h 35m · ₹4,820</li><li>09:45 · 2h 30m · ₹5,110</li><li>18:20 · 2h 40m · ₹5,390</li></ul>
 <p class="demo-note">Demo with sample data. In a real product, every step shown must be a step that actually ran.</p>
</div>'''

def mag_art():
    g = (K.tile(30, 40, 230, 130) + K.T(145, 96, "Instant?", 24, 800, font=K.DISPLAY) + K.T(145, 126, "\"did it even check?\"", 13, 600, K.MUTED)
         + K.tile(290, 150, 270, 160, True) + K.T(425, 200, "Shows the work", 22, 800, "#fff", font=K.DISPLAY)
         + "".join(f'<g class="mv-item" style="--i:{i}"><circle cx="320" cy="{232+i*24}" r="6" fill="{K.OR}" stroke="#fff" stroke-width="2"/>' + K.T(336, 237 + i * 24, s, 13, 600, "#e6e7ee", "start") + "</g>" for i, s in enumerate(["Checked 4 airlines", "Compared 212 fares", "Best 3 found"]))
         + K.bot(470, 80, 120, "ask", "chill"))
    return K.svg("Illustration: an instant answer next to an agent that shows its work", g, 340, 600, cls="mag-svg", bg="transparent")

def header(p):
    th = p["theme"]; base = f'''{{{{CRUMBS}}}}<p class="post-kicker">{tagline(p)}</p><h1>{escape(p["title"])}</h1>{byline(p)}'''
    tl = f'<div class="post-tldr"><b>TL;DR</b><p>{escape(p["tldr"])}</p></div>'
    if th == "terminal":
        lines = "".join(f'<span class="tl" style="--i:{i}">{escape(l)}</span>' for i, l in enumerate(p["term"]))
        return f'{base}<div class="term" role="img" aria-label="Terminal: the assistant plans, builds and tests, then asks before publishing"><div class="term-bar"><i></i><i></i><i></i><span>~/n8n</span></div><pre aria-hidden="true">{lines}<span class="cursor"></span></pre></div>{tl}'
    if th == "ticker":
        t = " · ".join(p["ticker"])
        return f'<div class="ticker"><b>BREAKING</b><p class="sr">{escape(t)}</p><div class="tk-track" aria-hidden="true"><span>{escape(t)} · {escape(t)} · </span><span>{escape(t)} · {escape(t)} · </span></div></div>{base}{tl}'
    if th == "postmortem":
        rows = "".join(f'<tr><th scope="row">{escape(k)}</th><td>{escape(v)}</td></tr>' for k, v in p["incident"])
        return f'{base}<div class="pm"><div class="pm-h"><span class="pm-dot" aria-hidden="true"></span>INCIDENT REPORT · AGENT RELIABILITY</div><table><caption class="sr">Incident summary</caption>{rows}</table></div>{tl}'
    if th == "receipt":
        rows = "".join(f'<li><span>{escape(k)}</span><span>{escape(v)}</span></li>' for k, v in p["receipt"])
        return f'{base}<div class="rcpt"><p class="rc-h">RECEIPT · AI USAGE · FROM 3 DEC 2026</p><ul>{rows}</ul><p class="rc-t"><span>Cost per outcome</span><span>Ask before you ship</span></p></div>{tl}'
    if th == "hundred":
        return f'<div class="hundred" aria-hidden="true"><span class="h-k">IN 100 SECONDS</span><span class="h-bar"><i data-h-fill></i></span><span class="h-t tnum" data-h-time>0:00</span></div>{base}{tl}'
    if th == "magazine":
        return f'<div class="mag-hero"><div class="mag-copy"><span class="mag-k">Design, explained</span>{base}{tl}</div><div class="mag-art" data-anim>{mag_art()}</div></div>'
    return base + tl

def figure(svgs, cls=""):
    return f'<figure class="post-figure wrap {cls}" data-anim>{PAUSE}{svgs}</figure>'

def place_meme(p, body):
    m = f'<figure class="meme-fig" data-anim>{p["meme"]()}</figure>'
    if "<h2>Why you should care</h2>" in body: return body.replace("<h2>Why you should care</h2>", m + "<h2>Why you should care</h2>", 1)
    parts = re.split(r"(?=<h2)", body)
    if len(parts) > 3: parts.insert(3, m)
    return "".join(parts)

def write_pages(pages_dir):
    pages_dir = Path(pages_dir)
    for old in pages_dir.glob("blog-*.html"): old.unlink()
    ordered = sorted(POSTS, key=lambda p: p["order"])
    for i, p in enumerate(ordered):
        nxt = ordered[i + 1] if i + 1 < len(ordered) else None
        prv = ordered[i - 1] if i else None
        body = place_meme(p, p["body"])
        body = body.replace("{{QUIZ}}", quiz()).replace("{{TIERS}}", tiers(p) if "tiers" in p else "").replace("{{DEMO}}", demo())
        body = re.sub(r"\{\{FIG:(\w+)\}\}", lambda m: PAUSE + FIGS[m.group(1)](), body)
        srcs = "".join(f'<li><a href="{u}" rel="noopener" target="_blank">{escape(t)}</a></li>' for t, u in p["sources"])
        nav = '<nav class="post-nav" aria-label="More field notes">' + \
              (f'<a href="{page_name(prv)}"><small>Previous</small>{escape(prv["title"])}</a>' if prv else '<span></span>') + \
              (f'<a href="{page_name(nxt)}" class="r"><small>Next</small>{escape(nxt["title"])}</a>' if nxt else '<a href="blog.html" class="r"><small>All notes</small>Back to Field Notes</a>') + '</nav>'
        meta = {"title": p["title"], "desc": "", "nav": "blog", "crumbs": [["Field Notes", "blog.html"], [p["title"], ""]]}
        html = f'''<!--{json.dumps(meta)}-->
<article class="post post--{p["theme"]}">
<header class="post-head wrap">{header(p)}</header>
{figure(p["fig"]())}
<div class="post-body wrap">{body}
<h2>Sources</h2><ol class="post-src">{srcs}</ol>
<div class="post-cta"><p><b>Building something like this?</b> We build and run AI agents for revenue teams. A person approves every important step.</p><a class="btn btn-primary" href="demo.html">Book a call</a></div>
{nav}
</div>
</article>
{{{{NONEXT}}}}
'''
        (pages_dir / page_name(p)).write_text(html)
    feat = ordered[-1]
    rest = [p for p in reversed(ordered) if p is not feat]
    card = lambda p, cls="": f'''<li class="bl-card {cls} th-{p["theme"]} rv"><a href="{page_name(p)}">{by_row(p, "h2")}</a></li>'''
    meta = {"title": "Field Notes", "desc": "", "nav": "blog", "crumbs": [["Field Notes", ""]]}
    (pages_dir / "blog.html").write_text(f'''<!--{json.dumps(meta)}-->
<section class="hero-band">
 <div class="wrap hero page-hero has-art">
  <div class="ph-copy">{{{{CRUMBS}}}}
  <h1>Notes from the people <span class="hl">who run the agents.</span></h1>
  <p class="sub">What our Chief Technology Officer, Chief Operating Officer and Director of Design learn running AI agents in production, every two weeks. Every claim is sourced.</p></div>
  {{{{ART:graph}}}}
 </div>
</section>
<section class="section"><div class="wrap">
 <div class="head rv"><span class="eyebrow">Featured · design</span><h2>Start with this one.</h2></div>
 <ul class="bl-grid bl-feat" role="list">{card(feat, "feat")}</ul>
 <div class="head rv" style="margin-top:var(--s5)"><span class="eyebrow">All notes</span><h2>Fresh from the lab.</h2></div>
 <ul class="bl-grid" role="list">{"".join(card(p) for p in rest)}</ul>
</div></section>
<section class="section tight"><div class="wrap"><div class="cta rv"><div><h2>Get the next note.</h2><p class="lead" style="margin-top:var(--s2)">Every two weeks. No sales emails. Unsubscribe whenever.</p><div class="hero-ctas" style="justify-content:flex-start;margin-top:var(--s4)"><a class="btn btn-primary btn-lg" href="report.html#subscribe">Subscribe</a><a class="link" href="agents.html">See our agents {{{{i:arrow}}}}</a></div></div>{{{{ART:agents}}}}</div></div></section>
''')

def latest(n=3):
    ordered = sorted(POSTS, key=lambda p: p["order"], reverse=True)[:n]
    return '<ul class="bl-grid bl-3" role="list">' + "".join(f'''<li class="bl-card rv"><a href="{page_name(p)}">{by_row(p)}</a></li>''' for p in ordered) + "</ul>"

def seo():
    out = {"blog.html": ("Field Notes - The Ezydrag blog on AI agents", "What Ezydrag's leaders learn running AI agents in production: n8n, MCP, harnesses, approvals, pricing and sales. Every claim sourced.", "0.7")}
    for p in POSTS: out[page_name(p)] = (p["seo_title"], p["desc"], "0.6")
    return out

def jsonld(page, site_url):
    for p in POSTS:
        if page_name(p) == page:
            return {"@type": "BlogPosting", "headline": p["title"], "description": p["desc"], "datePublished": WRITTEN, "dateModified": WRITTEN,
                    "keywords": ", ".join(p["tags"]), "timeRequired": f"PT{read_min(p)}M",
                    "author": [{"@type": "Person", "name": AUTHORS[a][0], "jobTitle": AUTHORS[a][1], "worksFor": {"@id": site_url + "/#org"}} for a in p["authors"]],
                    "publisher": {"@id": site_url + "/#org"}, "image": f"{site_url}/assets/blog/{p['slug']}.png", "mainEntityOfPage": f"{site_url}/{page}",
                    "citation": [u for _, u in p["sources"]]}
    if page == "blog.html":
        return {"@type": "Blog", "name": "Ezydrag Field Notes", "url": site_url + "/blog.html", "publisher": {"@id": site_url + "/#org"},
                "blogPost": [{"@type": "BlogPosting", "headline": p["title"], "url": f"{site_url}/{page_name(p)}"} for p in POSTS]}
    return None
