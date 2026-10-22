import { readingTime } from '../lib/reading-time'

export type PostCategory =
  | 'AI Systems'
  | 'Data'
  | 'Engineering'
  | 'Foundations'
  | 'Career'

export type Post = {
  slug: string
  title: string
  description: string
  date?: string
  category: PostCategory
  tags: string[]
  readingTime: number
  featured?: boolean
  canonical?: string
  origin?: 'linkedin'
  body: string
}

const rag = `There is a habit in AI engineering of treating retrieval-augmented generation as a new discipline. It is not. It is data modeling with a different access pattern, wearing a newer jacket.

The novelty is real in one narrow sense: embeddings let you search by meaning instead of exact tokens. That is a useful addition to the toolbox. But the work around it is familiar. You still decide what to store, how to chunk it, how to identify it, how to keep it fresh, how to bound latency, and how to explain why the wrong row came back.

A vector database is a tool. It is not a strategy.

## What backend engineers already know

If you have designed a database-backed system, you have already made most of the important RAG decisions:

- What is the unit of retrieval?
- What are the access patterns?
- What does a stale record cost?
- Which fields need to be exact, and which can be approximate?
- What is the latency budget?
- How do you trace a result back to its source?

The vector layer changes the answers to some of these questions. It does not remove them.

The chunking problem is a schema problem. If your chunks split a table in half or cut a clause away from its exception, no embedding model will recover the missing structure. The retrieval failure is downstream of the data model.

## The questions users actually ask

Users do not ask for \`similar documents\`. They ask why something happened, how a policy applies, what changed, or what to do next. Those are relational questions. They depend on time, entities, and definitions.

This is where the \`RAG\` framing gets in the way. If the question is \`what happened to this customer after the last escalation?\`, a pure similarity search is the wrong primitive. You need a customer entity, an event history, and a definition of escalation. Some of that belongs in a relational store. Some of it belongs in a graph. Some of it may belong in a vector index.

Using one store for all three is not simplicity. It is a decision to hide the model.

## Pick the retrieval substrate

I use a simple rule when choosing:

- If the answer depends on exact values, joins, or transactions, use a relational database.
- If the answer depends on relationships between entities, consider a graph.
- If the answer depends on fuzzy language or semantic similarity, use a vector index.
- If the answer depends on live business logic, expose a tool or an API. Do not embed a stale snapshot of it and call that retrieval.

Most production systems need more than one. My legal RAG project uses Qdrant for vectors and Neo4j for entity relationships because a clause can be semantically close to a question while being legally unrelated. The stores are not decoration; each represents a different access pattern.

The same logic applies to MCP. Exposing an existing analytics API as an agent-callable tool is often better than copying the analytics into an embedding index. The tool stays current. The source of truth stays where it belongs.

## A decision checklist

Before adding a vector database, answer these:

1. What is the retrieval unit: sentence, clause, section, row, or event?
2. What metadata must always travel with it?
3. Which questions require exact filters before similarity?
4. What happens when the index is stale?
5. How will you evaluate a miss, not just a hit?
6. Can the answer be traced to a source record?
7. What is the cost per query at the expected volume?

If those questions are unanswerable, the problem is not the embedding model. It is the model underneath.

## The evaluation question

A RAG system needs two kinds of evaluation, and teams often collapse them into one.

The first is retrieval evaluation. Did the right evidence make it into the candidate set? Measure recall at the cutoff that matters, not the cutoff that flatters the system. If the correct clause is at rank 20 and your context window only uses the top five, the retriever is not working for this product.

The second is answer evaluation. Given the evidence, did the answer make a claim that the evidence supports? Did it leave out the exception? Did it cite the right source? Those are different questions, and a high retrieval score does not answer them.

For the call-center analytics platform, we tracked retrieval faithfulness, conversation completeness, knowledge retention, and seven of eight DeepEval dimensions. Those metrics are useful because they connect retrieval to the task. They are not a substitute for reading failures. I still sample outputs, look at the citations, and ask whether a person could act on the answer.

The evaluation set needs to include the boring cases: a question with no evidence, a question with two conflicting sources, a question that requires a definition from another document. A system that only performs on clean, answerable questions is not ready for production.

## What this looks like in practice

On the call-center analytics platform, the retrieval layer sits on top of a star schema. The numbers in owner-level reports come from SQL, not from a language model. The LLM writes the narrative around evidence it can query. That separation is what makes the output auditable.

For the legal RAG system, the query decomposer breaks a long question into smaller evidence requests. Fusion checks whether each request has a source. The citation is assembled before the prose. That is not a prompt trick. It is a data contract.

The useful shift is to stop asking \`which vector database should I use?\` and start asking \`what access pattern does this question need?\`. Backend engineers have been answering that question for decades. The embedding is new. The discipline is not.`

const invisible = `Bangla text can look identical on screen and still be different bytes. That difference is a production problem.

Two words that render the same can tokenize differently. A word typed on Android may contain a zero-width joiner that a word typed on a desktop keyboard does not. A legacy font conversion may use a different code point for the same visual shape. Your tokenizer sees the difference even when your reviewer does not.

This is not a preprocessing footnote. It changes token counts, retrieval scores, and word error rate.

## The characters in the room

Three Unicode details matter immediately:

- **NFC normalization.** Canonical composition turns some decomposed sequences into a single code point. Normalize before you store, index, or compare.
- **ZWJ (U+200D)** joins characters in some scripts. In Bangla it can appear in sequences where it is not semantically meaningful for your pipeline.
- **ZWNJ (U+200C)** prevents a conjunct. It can be meaningful. Do not strip it blindly.

There are also visually confusable Bengali characters. The difference between a short and long vowel mark may be one code point, and a legacy keyboard layout may produce a different representation of the same intended word. If your pipeline treats each byte sequence as a distinct token, you have created vocabulary fragmentation without noticing.

A simple example is the difference between \`করছি\` and \`করসি\` in informal writing, or the spelling variation between \`দীর্ঘ\` and \`দির্ঘ\`. One is standard, one is a common informal variant. They may both appear in call transcripts. A byte-level tokenizer can split them into different sequences even when the intended meaning is the same.

## What byte-level BPE does with that

A byte-level tokenizer starts from bytes, not from your idea of a word. That is powerful because it can represent any text. It is also why normalization matters: two visually identical strings can map to different byte sequences, and therefore different token IDs.

The damage compounds:

1. The model sees more distinct forms than it needs to learn.
2. Rare variants get split into more tokens, which increases cost.
3. Embeddings drift because the same concept is represented by multiple vectors.
4. Retrieval returns a near-duplicate instead of the canonical record.
5. Word error rate moves for reasons that have nothing to do with the acoustic model.

In a speech pipeline, this is especially expensive. The ASR output is already uncertain. If the text layer adds another source of variance, you are debugging two systems at once.

## Normalize with intent

A production normalizer should be explicit about what it changes. Mine does four things:

- Normalize to NFC.
- Map known legacy font encodings to Unicode.
- Remove invisible characters only where the language rules allow it.
- Preserve ZWNJ where it changes the word.

That last point matters. A blanket \`strip zero-width characters\` rule is the kind of fix that looks clean in a notebook and breaks a conjunct in production.

~~~python
import unicodedata

def normalize_bangla(text: str) -> str:
    text = unicodedata.normalize("NFC", text)
    text = text.replace("\u200b", "")  # zero-width space
    text = text.replace("\ufeff", "")  # BOM
    # Do not remove U+200C or U+200D without a language rule.
    return text
~~~

The normalizer is a versioned component. When it changes, the tokenizer changes, the cache keys change, and the evaluation set needs to be re-run. Treating it as a throwaway utility is how you get a mysterious regression six weeks later.

## Evaluate what WER misses

Word error rate is a useful aggregate. It is not enough. A model can have a respectable WER and still fail on names, amounts, and negation.

For Bangla call audio, I care about:

- Normalized character error rate.
- Entity accuracy: names, phone numbers, amounts.
- Semantic similarity of the transcript to the reference.
- Retrieval hit rate for downstream questions.
- The percentage of outputs that fail normalization after ASR.

The last metric catches the invisible-character problem directly. If the same spoken phrase produces three token sequences, the text layer is not stable.

## A regression test that would have caught it

The easiest way to make this problem visible is to keep a small fixture of strings that should normalize to the same value.

~~~python
cases = [
    ("করছি", "করছি"),
    ("দীর্ঘ", "দীর্ঘ"),
    # Add the actual variant pairs found in your data.
]

for raw, expected in cases:
    assert normalize_bangla(raw) == normalize_bangla(expected)
~~~

That test looks trivial. It is also the one that fails when a font conversion, a keyboard layout, or a well-meaning cleanup script changes the text layer.

The second test is a tokenizer regression. For a fixed vocabulary, assert that the normalized fixtures produce the expected token ids. If the tokenizer changes, the test should fail loudly. Silent tokenizer changes are how retrieval evaluations lose their baseline.

## The checklist

If you are building a Bangla NLP or speech pipeline:

1. Normalize before storage and before tokenization.
2. Version your normalizer and tokenizer together.
3. Keep a small set of visually identical pairs as regression tests.
4. Audit zero-width characters by source device and font conversion.
5. Measure entity accuracy, not only WER.
6. Check retrieval duplicates, not only retrieval accuracy.
7. Store the original text and the normalized text. You will need both.

The invisible characters are not edge cases. In Bangla production data, they are the input.`

// TODO: confirm the 38% inference benchmark and its input distribution before publishing.
const thirteenDays = `Processing thirteen days of call audio in one day sounds like a model result. It is mostly a pipeline result.

The model matters. The data curation, segmentation, batching, normalization, and evaluation matter more. A production ASR system is a data system that happens to contain a neural network. If you tune the network before you understand the data, you will spend a long time optimizing the wrong error.

On the call-center analytics platform, we process more than 125 hours of calls per day. The pipeline had to handle low-bitrate telephony audio, Bangla dialect variation, code-switching, and a business that wanted yesterday's calls analyzed this morning.

## Start with the channel, not the benchmark

Generic ASR benchmarks are recorded under conditions that do not resemble a call center. Telephone audio is narrowband. It is compressed. It has background noise, hold music, and overlapping speakers. The model that performs well on clean read speech can fail on the exact audio you need to transcribe.

The first step is not fine-tuning. It is listening. Build a sample that represents the channel: different handsets, different agents, different background conditions, different call lengths. Transcribe a small set manually. Find the failure pattern.

Our failures were consistent:

- Names and locations were wrong.
- Amounts and dates were unstable.
- Word endings disappeared.
- Code-switched English terms were sometimes transliterated into Bangla script.

Those are not random errors. Each one points to a data or modeling decision.

## Curate before you train

A fine-tuning set is a product asset. It needs provenance, consent, and a clear split between training and evaluation. It also needs to represent the distribution you care about, not just the easiest recordings.

We curated domain audio and built a frozen evaluation set before tuning. That set included noisy calls, short calls, long calls, and calls with code-switching. We kept it out of training.

The split matters because ASR tuning is seductive. A model can improve on a small sample while getting worse on the cases that matter. Without a frozen set, every change looks like progress.

## Make the text layer deterministic

The transcript is not the end of the pipeline. It is the input to a tokenizer, a retrieval layer, and a report. If the text layer is unstable, every downstream metric becomes noisy.

We normalized Unicode, handled invisible characters, and built a Bengali tokenizer around the vocabulary the calls actually used. Token count dropped by 64 percent. That reduced inference cost and made the downstream context window behave more predictably.

The tokenizer is not a one-time notebook cell. It is a versioned artifact. Changing it changes the model input, the cache keys, and the evaluation baseline. Put it under the same discipline as the ASR weights.

## Throughput is a systems problem

Thirteen days of audio in one day is a batching and orchestration result. The pipeline has to segment long recordings, distribute work, retry failures without duplicating output, and persist progress.

Our design uses event-sourced ingestion and Go services around the speech workers. The details that mattered were unglamorous:

- Idempotent processing so a retry did not create two transcripts.
- Dead-letter handling for failed chunks.
- Bounded concurrency so a large backfill did not starve live traffic.
- Storage for both raw and normalized transcripts.
- Metrics on queue depth, processing time, and failure rate.

If a worker crashes after writing half a transcript, the system needs to know. If a retry succeeds twice, the system needs to know. "It worked locally" is not a throughput plan.

## What the backfill exposed

A large backfill is a different workload from live traffic. Live calls arrive in a stream. A backfill arrives as a wall of files with uneven durations, duplicate uploads, and recordings that fail validation halfway through.

The first version of the backfill made the live queue look bad. It was technically within the concurrency limit, but it competed for the same workers and storage. We separated the workloads, bounded the backfill concurrency, and made progress observable per file. The fix was not a better model. It was scheduling.

The backfill also exposed duplicates that live traffic hid. A retry could produce a second transcript for the same call. We added idempotency keys at the ingestion boundary and checked them again before writing the final transcript. That is the kind of bug that looks rare until you run two weeks of history through the system at once.

## Evaluate beyond WER

Word error rate is the headline. It hides the failures that break a business workflow.

Use a small dashboard:

| Metric | Why it matters |
| --- | --- |
| Normalized CER / WER | Model quality |
| Entity accuracy | Names and amounts drive decisions |
| Intent completeness | Did the transcript preserve what the caller wanted? |
| Downstream retrieval hit rate | Did the report find the right evidence? |
| Failure rate by channel | Which handsets or upload paths are broken? |
| Normalization failure rate | Is the text layer stable? |

Ours included 100% faithfulness and 100% conversation completeness on the downstream RAG evaluation, 93% knowledge retention, and 7 of 8 DeepEval dimensions. Those numbers are useful because they connect the transcript to the task, not because they are large.

The inference numbers need context. The defensible end-to-end improvement I tracked was 38% faster inference. Higher numbers reported on a noisy-telephony subset should not be presented as a general result. Benchmark context matters. If I cannot describe the input distribution, I do not publish the percentage.


## What to monitor in production

- Audio duration and channel mix.
- Queue depth and processed-hours lag.
- Chunk failure and retry counts.
- Transcript normalization failures.
- Entity extraction confidence by type.
- Cost per audio hour.
- Downstream answer failures traced back to ASR.

The last one is the most important. A transcript can look fine and still break the report because it lost a date. The ASR metric should be connected to the product outcome.

## A short version

Production ASR is not a model plus an API. It is a data curation process, a text normalization layer, a throughput system, and an evaluation loop. The model is one component.

If you are starting, build the evaluation set first. Then build the boring pipeline. Then fine-tune.`

const rabbit = `The queue said everything was fine. The messages were not in the queue. They were in our process.

This is a production debugging story about RabbitMQ, Go channels, acknowledgement timing, and the difference between "the broker is healthy" and "the system is working."

## The symptom

Messages were being published. The queue depth looked low. Consumers were connected. And yet some work never completed.

At first it looked like a broker problem. We checked connections, exchanges, bindings, and consumer counts. Everything was green. That is the dangerous part: the dashboard was telling the truth about the broker and nothing about the application.

## The shape of the bug

The consumer did something that looked reasonable:

1. Receive a delivery from RabbitMQ.
2. Acknowledge the delivery.
3. Put the message into a buffered Go channel.
4. Let a pool of workers process it.

The acknowledgement happened before the work. If the process crashed, or if the channel filled up, the message was gone. The broker had no reason to redeliver it because we had already told the broker it was handled.

The messages were not lost in RabbitMQ. They were sitting in process memory, waiting for a worker that might never pick them up.

## Why the queue depth looked healthy

Queue depth measures what is waiting in the broker. It does not measure what is waiting inside your process. Once a message is acknowledged, it leaves the broker's responsibility. A buffered Go channel is another queue, but it does not appear in the RabbitMQ dashboard.

We had built a second queue without monitoring it.

The buffered channel also gave us a false sense of smoothness. Writers could keep pushing until the buffer filled. There was no backpressure signal to the broker until the channel was full, and by then the acknowledgement had already happened.

## The fix

The principle is simple: acknowledge after the work is complete, not after it is accepted.

That means:

- Process the message first, or hand it to a worker with a guarantee that the worker will finish and acknowledge.
- Use manual acknowledgement.
- Bound the in-process buffer.
- Apply backpressure so the consumer stops accepting messages when workers are saturated.
- Handle failures with a dead-letter exchange instead of dropping them.
- Make processing idempotent because a redelivery may happen.

~~~go
for delivery := range deliveries {
    select {
    case jobs <- delivery:
        // The worker owns the ack after processing.
    case <-ctx.Done():
        _ = delivery.Nack(false, true)
        return
    }
}
~~~

The important part is not the exact syntax. It is the ownership rule: exactly one component owns the acknowledgement, and it owns it after the side effect.

## What we changed

We moved acknowledgement into the worker path and bounded the channel. We added a dead-letter exchange and queue so a failed message had somewhere to go. We made handlers idempotent and added an idempotency key where the operation could be repeated. We exposed channel depth, worker saturation, and processing latency in metrics.

Then we tested the failure cases:

- Kill the process with messages in flight.
- Fill the worker pool and observe backpressure.
- Force a handler failure and confirm the message lands in the DLQ.
- Redeliver the same message and confirm no duplicate side effect.

The bug was not exotic. It was an ownership boundary that looked harmless in code review.

## The observability lesson

A healthy broker is not a healthy system. Monitor every queue you create, including the ones that live in memory.

For each stage, ask:

- Where can work wait?
- Who owns acknowledgement?
- What happens on crash?
- What happens when the buffer is full?
- How do I see saturation before it becomes a loss?

If the answer is "the queue depth is fine," you may be looking at the wrong queue.

## The code review question

The bug survived review because the code looked tidy. Receive, acknowledge, enqueue. Each line had a clear purpose. The missing question was about ownership: who owns the message after the acknowledgement?

A useful review prompt for queue consumers is:

- Where is the acknowledgement?
- What has definitely happened before that line runs?
- What happens if the process dies immediately after it?
- What does the broker think happened?

If the acknowledgement comes before the side effect, the broker has been told a lie. That is the whole bug, independent of language or framework.

## What I would do differently

I would put the acknowledgement rule into a shared consumer helper instead of leaving it to each handler. The helper would own the delivery lifecycle: process, acknowledge on success, nack on retryable failure, dead-letter on permanent failure. Handlers would return an outcome, not call the broker directly.

I would also add a queue-depth metric for every in-process buffer and alert on worker saturation, not just broker depth. The dashboard should show the whole path, including the queue that lives in memory.

And I would write the crash test before the fix. Kill the process with messages in flight, restart it, and assert that every message is either completed or redelivered. That test turns an invisible boundary into a contract.

## The one-line version

Acknowledge after the work, not after the handoff. The broker can only protect what it still owns.`

const graph = `Most learning advice is a list of technologies. Learn Docker. Learn Kubernetes. Learn this framework. Learn that vector database. The result is a collection of nodes with very few edges.

A knowledge graph is more useful than a tech stack because the graph is what lets you transfer an idea from one context to another. Frameworks change. The edges stay.

## The node without the edge

I have interviewed people who can explain what an async function does but cannot explain what happens when a request hits a server. They know the syntax. They do not have the edge between the language feature and the runtime.

That is not a knowledge gap in the usual sense. It is a missing relationship. The concept exists in isolation.

The same thing happens with concurrency. Goroutines, threads, event loops, async/await, and coroutines are often taught as separate features. They are implementations of a small set of ideas: scheduling, shared state, blocking, and cancellation. Once you connect them, learning the next one gets cheaper.

## Build edges on purpose

A practical method:

1. Pick a concept you already use.
2. Ask what problem it solves and what it costs.
3. Find the same problem in another language or system.
4. Write down the mapping.
5. Test the map by explaining a failure mode.

For concurrency, the map looks like this:

| Idea | Go | Python | JavaScript |
| --- | --- | --- | --- |
| Lightweight task | goroutine | asyncio task | promise |
| Coordination | channel | queue / future | event loop callback |
| Cancellation | context | cancellation token | AbortController |

The point is not that these are identical. They are not. The point is that you now have a place to attach the differences.

## The interview story

I once asked a candidate what server runs their API. The answer was "the framework." That is a node with no edges. The framework is a library. Something has to listen on a socket, parse HTTP, manage connections, and run the code.

You do not need to be a kernel engineer to build a backend. You do need to know that the server is a program.

The same question applies to memory. If you cannot say where the data lives or what keeps it alive, you will struggle with leaks, caches, and concurrency bugs. The language may manage memory for you. It does not remove the concept.

## Start with the failure

A good way to build an edge is to start from a failure:

- Why did the process consume more memory after the cache was added?
- Why did the async endpoint block under load?
- Why did the retry create duplicates?
- Why did the queue look healthy while work was lost?

Each failure sits at an intersection. The fix requires two nodes and the edge between them. That is why incident reviews are such good learning tools.

## A concrete example: caches and memory

A cache is a good test of whether your graph has edges. The node is easy: a key-value store with a time-to-live. The edges are harder.

What keeps an entry alive? What invalidates it? What happens when the source of truth changes? What is the memory bound, and what evicts first? What does a cache miss cost? What does a stale hit cost?

If you can answer those, you have connected the cache to storage, concurrency, and product behavior. If you cannot, you have added a faster source of bugs.

The same pattern applies to retries. A retry node connects to idempotency, timeouts, and observability. Without those edges, adding a retry feels like resilience while making the system less predictable.

## A small curriculum

If you want to build the graph rather than collect tools:

1. Write a TCP server that handles one request at a time. Then make it concurrent.
2. Implement a bounded queue and a worker pool. Then break it with backpressure.
3. Build a small database table with an index. Then read the query plan.
4. Write a retry with idempotency. Then force a duplicate.
5. Read a language runtime's scheduler documentation. Then map it to what you already know.

These exercises are not a portfolio. They are edges.

The stack will keep changing. The graph is the part you keep.`

const rowsToVectors = `Every few years the storage industry adds an access pattern and the marketing department announces that the old one is dead. Relational databases did not die when document stores arrived. Documents did not die when vector search arrived. The questions stayed the same.

Vector search is useful because it answers a new question: what is semantically close to this text? That is not the only question a system needs to answer.

## The old questions

Before you pick a store, you still need to answer:

- What is the unit of data?
- What are the read and write patterns?
- What must be exact?
- What can be approximate?
- How fresh does the data need to be?
- What is the latency budget?
- What happens on failure?
- How do you audit a result?

An embedding index changes the index structure. It does not remove the data model.

## Rows first

A relational table is a strong default because it gives you constraints, transactions, joins, and a query planner. If the question is "which orders were late and which customer owns them?", a relational database is a good fit. The answer depends on exact relationships and current state.

Vector search is weak at exactness. It can retrieve a semantically similar order, but it will not reliably enforce a foreign key or a date filter. Hybrid retrieval works because it combines the strengths instead of pretending they are the same.

## Documents next

Document stores are useful when the shape varies and the unit is naturally self-contained. They are a poor excuse to avoid modeling relationships. If the application constantly joins documents in application code, the schema is telling you something.

The same is true of chunking in RAG. A chunk is a document unit. If you cut a policy in the middle and lose its scope, you have made a bad schema decision. The embedding will not repair it.

## Embeddings add intent

Vector search is different because the query is often a question, not a key. That is genuinely useful. It lets a user ask "how do I change my address?" and retrieve a paragraph that never uses the word "address" in the same way.

The price is interpretability. A nearest-neighbor result is a score, not an explanation. If the system needs to cite a clause, the vector score is not enough. You need the source and the relationship.

## Graph when relationships are the question

A graph store earns its place when the relationship is the thing being queried. In the legal RAG project, a clause can be semantically similar to a question while being connected to the wrong entity or the wrong time period. Neo4j represents those edges directly.

Using a graph because it sounds advanced is a mistake. Using it because your queries are relationship-shaped is not.

## The access pattern checklist

| Question | Likely store |
| --- | --- |
| Exact filters and joins | Relational |
| Self-contained documents with variable shape | Document |
| Semantic similarity over text | Vector |
| Multi-hop relationships | Graph |
| Live business logic | API or tool call |

Most production systems combine several. The important decision is not the vendor. It is the access pattern and the source of truth.

## The hybrid question

Hybrid retrieval is often presented as a feature. It is better understood as an admission that no single representation answers every question.

A hybrid system needs a fusion rule. Should exact filters run before vector search? Should graph expansion happen after? How many candidates does each path contribute? What wins when the scores disagree? Those are data modeling questions, not model questions.

If you cannot explain why a result was included, adding another retriever makes the system harder to debug. Start with the access pattern. Add the second store when you can name the failure it fixes.

## Enhance, do not replace

The useful conclusion is boring: vector search enhances the toolbox. It does not replace data modeling. The teams that do well with RAG are usually the teams that were already good at schemas, indexing, caching, and evaluation.

If you are adding embeddings to an existing system, start with the questions users ask. Then decide which store can answer them with the right freshness, latency, and traceability. The vector index is one answer, not the answer.`

const leetcode = `I have solved more than 1,200 data structures and algorithms problems. That number is useful for exactly one thing: it shows I can keep a practice habit. It is a poor proxy for whether I can do the job.

The job is not a timed contest. It is a series of ambiguous problems with other people.

## What the count teaches

Competitive programming gave me real skills:

- Pattern recognition under time pressure.
- Comfort with complexity analysis.
- The ability to debug an implementation from a counterexample.
- A tolerance for being wrong in public.

Those are valuable. They show up in production work when a query is slow, a retry loop is wrong, or an edge case is hiding in a boundary condition.

## What it does not teach

It does not teach you to communicate a tradeoff. It does not teach you to ask whether the problem is worth solving. It does not teach you to work inside a codebase with a history and a team.

An interview is closer to a shared debugging session than to a contest. The interviewer is not only checking whether the solution is correct. They are checking whether your thinking is legible.

That distinction matters more as implementation gets cheaper. A model can write the code. The scarce skill is choosing what to build, noticing the constraint, and explaining why the simple solution is insufficient.

## The part I had to learn

My early interview habit was to solve silently and then present the answer. That felt efficient. It hid the most useful part: how I got there.

The better pattern is:

1. Restate the problem in your own words.
2. Draw the smallest example.
3. State the naive solution and its cost.
4. Name the constraint that matters.
5. Improve one step at a time.
6. Test the edge cases out loud.
7. Stop when the tradeoff is acceptable.

This is not performance. It is how a real design review works.

## What to practice instead

If I were mentoring someone for interviews, I would still assign algorithms. But I would add:

- Explain a solution to a non-engineer in two minutes.
- Review someone else's code and find the risk.
- Take a working script and make it survive a retry.
- Read a query plan and explain why the index was ignored.
- Write a design memo with one diagram and three tradeoffs.

Those exercises connect the algorithm node to the engineering graph.

## What I ask now

When I practice, I ask different questions than I did as a contestant:

- Can I state the invariant in one sentence?
- What is the smallest failing example?
- Which part of the solution is essential, and which is an optimization?
- What would I do if the input did not fit in memory?
- How would I test this if I could not run the whole system?

Those questions transfer to backend work. A query plan, a retry loop, and a distributed lock all have invariants. The algorithm habit helps you find them. The communication habit helps someone else agree.

## A note on the number

1,200 is not a personality. It is a record of time spent. The useful claim is not "I solved a lot." It is "I can sit with a hard problem, find the invariant, and explain it clearly."

That is the skill I want to be measured on.`

const featureEngineering = `The phrase "feature engineering" often gets reduced to adding columns. That is the least interesting definition.

A feature is a bet about what matters. You take a raw signal, transform it into a representation, and assert that this representation helps the model separate the cases you care about. The job is not to add more inputs. It is to encode a hypothesis the model can test.

## A feature is a decision

Suppose you are predicting delivery delays. The raw data has an order timestamp and a delivery timestamp. You can compute duration in seconds. That is a feature.

But the useful feature may be "is this order in a dense area at rush hour?" or "has this courier had a late delivery in the last hour?" The raw timestamps are inputs. The feature is your interpretation of them.

That interpretation comes from domain knowledge, not from the algorithm. A model can find interactions if you give it enough data and capacity. It cannot invent the data you never recorded.

## Good features

Good features tend to have four properties:

- They are available at prediction time.
- They have a stable definition.
- They represent a real distinction in the world.
- They are not a leak from the future.

The last one is the classic failure. A feature that includes the final delivery status will predict the delivery status perfectly in training and be useless in production.

Leakage is not a model bug. It is a data design bug.

## Transformation is part of the contract

A feature is not just a value. It is a value plus a transformation plus a version. If you change the binning, the normalization, or the missing-value policy, the meaning changes.

That is why feature stores exist. Not because teams love infrastructure, but because the same feature needs to be computed consistently in training and serving. A training pipeline that computes a rolling average differently from the online pipeline is a silent bug.

You do not need a feature store to get this right. You do need one definition and one owner.

## The modeling loop

Feature engineering is iterative:

1. Start with a baseline and a metric.
2. Inspect errors, not just accuracy.
3. Form a hypothesis about what is missing.
4. Add or change one feature.
5. Re-evaluate on a held-out set.
6. Check the serving path.

The discipline is the same one you would use for performance work. Measure, hypothesize, change one thing, measure again.

## When not to engineer

Sometimes the best feature is a better label. Sometimes it is more data. Sometimes it is a simpler model. Adding features to compensate for a noisy target is a way to overfit with extra steps.

If the model is failing on a segment, inspect the segment before adding a global feature. The problem may be that the data collection is broken for those users, not that the model lacks a column.

## A working definition

Feature engineering is the act of turning raw data into a representation that makes the target distinction easier, while preserving the constraints of the production system.

That is why it is closer to product thinking than to algorithm selection. You are deciding what the world looks like to the model. The decision has consequences.

The next time you add a column, ask what bet it represents. If you cannot answer, you are not engineering a feature. You are hoping.`

const sigmoid = `The sigmoid function looks like a small piece of calculus. It is actually two decisions in one curve.

It squashes any real number into the interval between zero and one. And it has a derivative that is easy to express in terms of its output. Those two properties are why it shows up in binary classification and in the hidden layers of older neural networks.

## The shape

The logistic function is:

~~~text
sigma(z) = 1 / (1 + e^(-z))
~~~

When \`z\` is large, the denominator approaches one, so the output approaches one. When \`z\` is very negative, the denominator becomes large, so the output approaches zero. At \`z = 0\`, the output is 0.5.

That is a smooth step. It does not make a hard decision; it gives you a score that can be interpreted as a probability.

## Why the derivative matters

Differentiate the function and you get:

~~~text
sigma'(z) = sigma(z) * (1 - sigma(z))
~~~

This is convenient. If you already computed the output, you can compute the gradient without another exponential. In a neural network, that saves work and keeps the backward pass simple.

The derivative is largest at 0.5 and small at the extremes. That is the source of the vanishing gradient problem: when a sigmoid unit is saturated, its gradient is close to zero, and learning slows down.

## It is not a probability by itself

A sigmoid output is a number between zero and one. It is a probability only if the model is calibrated and the assumptions of the problem fit. A random forest can output 0.9 without meaning "90% chance."

For logistic regression, the sigmoid is the link function that turns a linear score into a Bernoulli probability. The model still has to be trained and evaluated. The shape of the curve does not guarantee the meaning.

## Why not a step function?

A hard threshold would be simpler for classification. It would also have a derivative of zero almost everywhere, which makes gradient-based learning useless. The sigmoid is a smooth approximation that gives the optimizer a direction.

That is the recurring theme in deep learning: replace a hard decision with a differentiable version, train it, then threshold at inference if needed.

## When to use it

Use a sigmoid for:

- Binary classification with a probabilistic output.
- Gates that need to be bounded between zero and one.
- The final layer when the target is binary.

Be cautious with:

- Deep hidden layers, where saturation makes gradients vanish.
- Multi-class problems, where softmax is usually the right choice.
- Cases where calibration matters and you have not checked it.

The sigmoid is not magic. It is a well-behaved curve with a useful derivative. That is enough.`

const gradientDescent = `Gradient descent is a loop with a budget.

You have a function that measures how wrong the model is. You want to make it smaller. The gradient tells you the direction of steepest increase, so you step in the opposite direction. Repeat until the budget runs out or the improvement stops.

## The update

For a parameter vector \`w\`:

~~~text
w(t+1) = w(t) - learning_rate * gradient(L(w(t)))
~~~

\`L\` is the loss. The learning rate is the step size. The gradient points uphill, so subtracting it moves downhill.

That is the whole idea. Everything else is engineering.

## The learning rate is the system

If the step is too small, training takes forever. If it is too large, the loss jumps around or diverges. The learning rate is not a minor hyperparameter. It is the difference between a working loop and a random walk.

Modern optimizers adapt the step per parameter. Adam, RMSProp, and their relatives maintain moving estimates of gradients and squared gradients. They make the loop more robust, not automatic. You still need to inspect the loss curve.

## Batch size changes the gradient

Computing the exact gradient over the full dataset is expensive. Stochastic gradient descent estimates it from a mini-batch. The estimate is noisy, but the noise can help escape shallow regions.

Batch size affects:

- The variance of the gradient.
- Memory use.
- How many updates you get per epoch.
- Whether you can use hardware efficiently.

A larger batch is not automatically better. It gives a more accurate gradient but fewer updates for the same amount of data.

## Stop conditions

Training ends when a budget is exhausted or a validation metric stops improving. Early stopping is a form of regularization: it prevents the model from continuing to fit noise.

You need a validation set that was not used to compute the gradient. Without it, you are optimizing a number that does not tell you whether the model will work.

## Where it breaks

Gradient descent assumes the gradient is informative. It can fail when:

- The loss is badly scaled.
- The gradients vanish or explode.
- The data has leakage.
- The model is too large for the data.
- The optimizer is fine but the labels are wrong.

Most training failures are not mysterious. They are one of those five.

## The mental model

Gradient descent is a local search. It does not know the global shape of the loss surface. It only knows the slope at the current point.

That is why initialization, architecture, and data matter. They shape the surface the optimizer sees.

The loop is simple. The hard part is making the surface worth descending.`

const cnn = `A convolutional neural network is not a magic box that understands images. It is a small, repeated bet about locality.

The bet is simple: nearby pixels are more related than distant pixels, and the same pattern can appear in different places. If that bet is true for your data, a convolution is an efficient way to learn.

## The kernel

A convolution slides a small filter across the input. At each position, it multiplies the local patch by the filter weights and sums the result. The same filter is reused across the image.

That reuse is the important part. A fully connected layer would learn a separate weight for every pixel position. A convolution learns one detector and applies it everywhere. This is called weight sharing, and it dramatically reduces the number of parameters.

## Why it works for images

An edge is an edge whether it appears in the top-left or bottom-right corner. A convolution can learn an edge detector once and use it across the whole image.

Stacking convolutions builds a hierarchy:

- Early layers detect edges and colors.
- Middle layers combine them into textures and parts.
- Later layers combine parts into objects.

The hierarchy is learned, not hand-coded. But the architecture encodes a prior: locality and translation equivariance.

## What convolution is not

A convolution layer is not a complete model. It needs non-linearity, pooling or stride, normalization, and a classifier. Modern architectures also use residual connections and attention.

The convolutional prior is not universal. For some tasks, long-range relationships matter more than local texture. That is why transformers became dominant in language and increasingly in vision. The architecture should match the structure of the problem.

## A small example

If you apply a 3×3 filter to an image, each output cell sees a 3×3 neighborhood. Stack two layers, and the receptive field grows. Stack enough, and a cell can see a large portion of the image.

This is why depth matters. Each layer expands what the network can reason about.

## Why it is not magic

The network still needs data, labels, and a loss. It can still overfit. It can still learn a shortcut. It can still fail on a distribution shift.

The convolution gives you an inductive bias. It does not give you a guarantee.

The useful question is not "is CNN magic?" It is "does the locality assumption hold for this problem?" If it does, convolution is an efficient prior. If it does not, the architecture is working against you.

That is the whole trick. A good prior, applied honestly.`

const transformer = `A transformer is often described as if it were a mysterious new form of intelligence. At the level of the computation, it is closer to a learned lookup table with weights.

That description is incomplete, but it is a useful place to start.

## Tokens become vectors

Text is split into tokens. Each token becomes a vector. Those vectors are the only thing the model operates on. There is no hidden dictionary of meanings inside the forward pass. The meaning is in the learned weights and the context.

## Attention is a weighted lookup

For each token, the model creates three vectors:

- A query: what am I looking for?
- A key: what do I contain?
- A value: what do I pass along if I match?

The query is compared with the keys. The comparisons become scores. The scores are normalized into weights. The output is a weighted sum of the values.

That is attention. A token can look at other tokens and decide what to bring into its representation.

## Why multiple heads

One attention head can only express one kind of relationship. Multiple heads let the model attend to different patterns in parallel: syntax, coreference, position, and so on. The heads are concatenated and projected.

The model is not told which head does what. The division of labor emerges from training.

## Position matters

Attention alone is order-blind. The model needs positional information. Early transformers added sinusoidal position encodings. Later models use learned or rotary position encodings. The detail changes; the need does not.

If you shuffle the tokens and keep the same position labels, the output should change. If it does not, something is wrong.

## The feed-forward block

After attention, each token passes through a feed-forward network. This is where a lot of the model's capacity lives. Attention mixes information between tokens; the feed-forward layer transforms each token's representation.

Stack these blocks, add residual connections and normalization, and you have a transformer.

## What it is not

It is not a database. It does not retrieve facts from a store unless you build that layer. It is not a reasoning engine in the symbolic sense. It is a function trained to predict the next token, with representations that turn out to be useful for many tasks.

That is why retrieval, tools, and evaluation matter. The model is a component, not a system.

## The useful mental model

Think of attention as a soft lookup. Each token asks a question, compares it with the available keys, and pulls in a weighted mixture of values. Stack that operation and you get a model that can represent relationships across a sequence.

The mystery is not that it works. The interesting part is how much structure emerges from a simple differentiable operation trained at scale.

That is not magic. It is a good prior, a lot of data, and a lot of compute.`

export const posts: Post[] = [
  {
    slug: 'rag-is-not-a-new-engineering-discipline',
    title: 'RAG is not a new engineering discipline',
    description:
      'A vector database is a tool, not a strategy. What backend engineers already know about data modeling is the actual job.',
    date: '2026-10-22',
    category: 'AI Systems',
    tags: ['RAG', 'Data modeling', 'Retrieval', 'MCP'],
    readingTime: readingTime(rag),
    featured: true,
    body: rag,
  },
  {
    slug: 'invisible-characters-bangla-nlp',
    title: 'The invisible characters breaking your Bangla NLP pipeline',
    description:
      'NFC, ZWJ, ZWNJ, and byte-level BPE: how visually identical Bangla words become different token sequences, and what that does to WER and retrieval.',
    date: '2026-10-22',
    category: 'Data',
    tags: ['Bangla', 'Unicode', 'ASR', 'Tokenization'],
    readingTime: readingTime(invisible),
    body: invisible,
  },
  {
    slug: '13-days-of-call-audio-in-1-day',
    title: '13 days of call audio in 1 day',
    description:
      'What production Bangla ASR actually takes: low-bitrate telephony, curated data, a custom tokenizer, and evals that catch what WER misses.',
    date: '2026-10-22',
    category: 'AI Systems',
    tags: ['ASR', 'Bangla', 'Production', 'Evaluation'],
    readingTime: readingTime(thirteenDays),
    body: thirteenDays,
  },
  {
    slug: 'rabbitmq-bug-go-channel',
    title: 'The RabbitMQ bug that was hiding in a Go channel',
    description:
      'Messages looked lost. They were sitting in process memory. A production debugging story about acknowledgement, buffering, and observability.',
    date: '2026-10-22',
    category: 'Engineering',
    tags: ['RabbitMQ', 'Go', 'Observability', 'Incident'],
    readingTime: readingTime(rabbit),
    body: rabbit,
  },
  {
    slug: 'build-the-knowledge-graph',
    title: 'Build the knowledge graph, not the tech stack',
    description:
      'Frameworks are implementations of ideas. A practical way to connect concurrency, memory, and systems knowledge instead of collecting tools.',
    date: '2026-10-22',
    category: 'Career',
    tags: ['Learning', 'Systems', 'Interviews'],
    readingTime: readingTime(graph),
    body: graph,
  },
  {
    slug: 'from-rows-to-vectors',
    title: 'From rows to vectors: the more data changes, the more it stays the same',
    description:
      'Vector search did not replace data modeling. It added another access pattern, and the old questions still decide whether retrieval works.',
    date: '2026-10-22',
    category: 'Data',
    tags: ['Vector search', 'Data modeling', 'RAG'],
    readingTime: readingTime(rowsToVectors),
    body: rowsToVectors,
  },
  {
    slug: 'what-1200-leetcode-problems-dont-teach',
    title: "What 1,200 LeetCode problems don't teach you",
    description:
      'Interviews test whether your thinking is legible. What 1,200 solved problems teach, and what they quietly leave out.',
    date: '2026-10-22',
    category: 'Career',
    tags: ['Interviews', 'Problem solving', 'Communication'],
    readingTime: readingTime(leetcode),
    body: leetcode,
  },
  {
    slug: 'what-is-feature-engineering',
    title: 'What is feature engineering, really?',
    description:
      'A feature is a bet about what matters. The job is not adding columns; it is encoding a hypothesis the model can test.',
    category: 'Foundations',
    tags: ['Machine learning', 'Features', 'Data'],
    readingTime: readingTime(featureEngineering),
    origin: 'linkedin',
    body: featureEngineering,
  },
  {
    slug: 'why-sigmoid-works',
    title: 'Why does the sigmoid function actually work?',
    description:
      'The sigmoid function is not decoration. It turns a score into a probability and gives gradient descent a reason to keep moving.',
    category: 'Foundations',
    tags: ['Math', 'Neural networks', 'Classification'],
    readingTime: readingTime(sigmoid),
    origin: 'linkedin',
    body: sigmoid,
  },
  {
    slug: 'what-is-gradient-descent',
    title: 'What is gradient descent, actually?',
    description:
      'Gradient descent is a loop with a budget. Here is what the update rule is actually doing, and where it breaks.',
    category: 'Foundations',
    tags: ['Math', 'Optimization', 'Training'],
    readingTime: readingTime(gradientDescent),
    origin: 'linkedin',
    body: gradientDescent,
  },
  {
    slug: 'is-cnn-magic',
    title: 'Is CNN some out-of-the-box magic?',
    description:
      'A convolution is a small, repeated bet about locality. That is why CNNs work, and why they are not magic.',
    category: 'Foundations',
    tags: ['Deep learning', 'CNN', 'Computer vision'],
    readingTime: readingTime(cnn),
    origin: 'linkedin',
    body: cnn,
  },
  {
    slug: 'can-you-feel-transformer',
    title: 'Can you actually feel what a Transformer does?',
    description:
      'Attention is a lookup with weights. A mental model for what a transformer actually does, without the mystique.',
    category: 'Foundations',
    tags: ['Transformers', 'Attention', 'Deep learning'],
    readingTime: readingTime(transformer),
    origin: 'linkedin',
    body: transformer,
  },
]

export const categories: ('All' | PostCategory)[] = [
  'All',
  'AI Systems',
  'Data',
  'Engineering',
  'Foundations',
  'Career',
]

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug)
}

export function sortedPosts() {
  return [...posts].sort((a, b) => {
    if (a.date && b.date) return b.date.localeCompare(a.date)
    if (a.date) return -1
    if (b.date) return 1
    return posts.indexOf(a) - posts.indexOf(b)
  })
}

export function getAdjacentPosts(slug: string) {
  const ordered = sortedPosts()
  const index = ordered.findIndex((post) => post.slug === slug)
  return {
    previous: index > 0 ? ordered[index - 1] : undefined,
    next: index < ordered.length - 1 ? ordered[index + 1] : undefined,
  }
}

export function getRelatedPosts(post: Post, limit = 2) {
  return posts
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => {
      const tagOverlap = candidate.tags.filter((tag) => post.tags.includes(tag)).length
      const categoryMatch = candidate.category === post.category ? 1 : 0
      return { candidate, score: tagOverlap * 2 + categoryMatch }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.candidate)
}
