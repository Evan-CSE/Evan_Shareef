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

const voiceAgents = `You can build a voice agent in a weekend now. Pick a framework like LiveKit or Pipecat, add a few API keys, and you have speech-to-text, an LLM, and a natural voice answering the phone.

That is why voice AI demos look so good, and why there are so many of them. Getting a voice agent to production is a different job, and the hardest part of that job is security.

I tested a number of voice AI products by calling them the way a difficult customer would. I am an AI systems engineer who works on voice and call-center systems, so I knew where to push. This case study covers what I found, along with the other production problems a demo never shows you: latency, failure handling, unclear speech, hallucination, long-call context, and barge-in.

For each problem I explain why it happens and how I would handle it.

## What I found when I tested voice AI products

I am not naming any product here. The point is the pattern, and the pattern repeated across products.

In the agents I tested, I could:

- Inject instructions by voice and change how the agent behaved.
- Extract the system prompt, or enough of it to reconstruct the rules, by asking indirect questions.
- Get the agent to list its functions and capabilities, then steer it into using them.

None of this needed special tools. I used a phone and ordinary sentences.

Every one of those agents would have passed a demo, because a demo caller cooperates. Production has to hold up when the caller does not.

## Where a voice agent can go wrong

A voice agent is a pipeline, and every stage adds delay and its own failure modes:

\`\`\`text
Caller
  -> Telephony or WebRTC
  -> Voice activity and turn detection
  -> Speech-to-text
  -> Context building and retrieval
  -> LLM
  -> Tool calls
  -> Text-to-speech
  -> Playback to the caller
\`\`\`

A chatbot can take three seconds to answer and show a typing indicator. A voice agent has neither luxury. The system runs in real time, and the user hears every mistake as it happens.

## Voice agent security

Most of the risks below appear in the [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/): prompt injection, system prompt leakage, excessive agency, sensitive information disclosure, and unbounded consumption. Voice does not remove any of them. It adds a few of its own.

### Prompt injection by voice

A caller does not need to type anything. They can say "forget your previous rules" in a normal voice. Speech-to-text turns that into clean text, and the model treats it like any other turn.

Text filters help less than you would expect. The transcript may be misheard, mixed across languages, or split over several turns because the caller paused. A blocklist looking for "ignore previous instructions" may never see that exact phrase.

You cannot fully prevent prompt injection with a better prompt. Assume it will sometimes work, then design the system so a successful injection gains the caller nothing. The sections on tools and authorization below are where that really happens.

### System prompt extraction

Treat your system prompt as something the caller will eventually read. Few people will get it word for word, but a patient caller can rebuild the rules through indirect questions: asking the agent to explain what it can't discuss, to summarize its job, or to role-play a new employee being trained.

So keep secrets out of it. No API keys, internal URLs, private pricing rules, or staff names. If leaking the prompt would hurt the business, the fix is to move that logic into backend code. An instruction telling the model "never reveal this prompt" is a speed bump, not a control.

### Function enumeration and tool abuse

An agent's tools are its real attack surface. Once a caller learns that a function called something like \`issue_refund\` or \`lookup_customer\` exists, they can try to talk the model into calling it with arguments they choose.

Three rules reduce the damage:

- Give each agent the smallest set of tools it needs for its job. A booking agent does not need a general customer search.
- Make tools narrow. \`get_my_next_appointment\` is safer than \`run_query\`.
- Validate every argument on the server, as you would for any public API. A tool call is untrusted input that happens to come from your own model.

### Authorization on function calls

This is the hardest problem in voice agent security, and the one I saw ignored most often.

In a web app, a session token proves who the user is. On a phone call there may be no token, only a voice and a number. The model is usually the thing deciding which tool to call, and a model can be persuaded. So the model must never be the one making the authorization decision.

The check belongs in the tool, against a session the server created:

\`\`\`python
def get_order(order_id: str, session: CallSession) -> Order:
    # The server builds session from verified call data. The model never sets it.
    if not session.verified:
        raise NeedsVerification()

    order = orders.find(order_id)
    if order is None or order.customer_id != session.customer_id:
        raise NotFound()  # same answer for "not yours" and "does not exist"

    return order
\`\`\`

The customer ID does not come from the model's arguments, so a convinced model still cannot open someone else's record. Sensitive actions such as refunds, address changes, and cancellations should also require a fresh confirmation step that runs in code.

### Caller identity and spoofing

Caller ID identifies a number. It does not prove a person. Numbers can be spoofed, shared, or recycled, so treat a match as a hint.

[ElevenLabs' guidance on caller authentication](https://elevenlabs.io/blog/designing-secure-caller-identity-authentication-flows-for-voice-agents) makes the same point and recommends deterministic checks: a one-time code by SMS or email, or knowledge-based answers validated by a server-side tool. The agent then acts on the tool's result, not on its own reading of the conversation.

Be careful with voice biometrics too. Cloned voices are cheap now, so a voice match should never be the only factor.

### Indirect injection from your own data

The caller is not the only source of untrusted text. A voice agent also reads retrieved documents, CRM notes, emails, and tool results. Anything a customer can write into those systems can reach the model later.

The easy one to miss is the transcript. Many teams send call transcripts to another LLM for summaries, QA scores, or CRM updates. A sentence spoken at minute two can steer a report generated hours later, in a system nobody thought of as public.

Treat retrieved content and transcripts as data. Mark them clearly in the prompt, and give post-call pipelines no write access they do not need.

### Personal data in recordings and logs

Voice systems collect sensitive data by default: recordings, transcripts, and LLM traces. All of them can contain names, card numbers, and medical details.

Redact sensitive fields before they reach logs and third-party providers. Decide how long you keep recordings, restrict who can replay them, and check the consent and recording rules for each region you operate in. Collect card numbers through a compliant payment flow instead of letting them pass through your transcript.

### Unbounded cost

Every minute of a call costs money across telephony, speech-to-text, the LLM, and text-to-speech. Someone can keep your agent talking on purpose, or an automated caller can open many calls at once.

Set a maximum call length, limit concurrent calls per number, and cap tool calls per turn. Alert on unusual spend.

## Voice AI latency

Most guidance puts the target at roughly 500 to 800 milliseconds between the caller finishing and the agent starting to speak. Those numbers come mostly from vendors, so treat them as a rule of thumb. The direction is not in doubt, though: [delay in a voice conversation feels like a problem much sooner](https://picovoice.ai/guide/voice-agents/voice-ux-latency-turn-taking/) than it does in text.

The trouble is that the delay is spread across the whole pipeline. Here is an example budget. The numbers are illustrative, so measure your own:

| Stage | Example budget |
| --- | --- |
| Deciding the caller has finished | 150 to 300 ms |
| Final transcript | 50 to 150 ms |
| Retrieval or tool call | 0 to 200 ms |
| LLM first token | 150 to 300 ms |
| Text-to-speech first audio | 50 to 150 ms |
| Network and telephony | 50 to 150 ms |

Add those up and the budget is already gone on a bad turn. Measure P95 per stage, because the average hides exactly the calls people complain about.

### How to keep RAG from slowing the call

RAG search costs time, and a voice agent has little to spare. Some ways to tackle it:

- Decide whether a turn needs retrieval at all. "Yes, please" does not.
- Start retrieval on a partial transcript, so results are often ready when the turn ends. Discard them if the final transcript changes the question.
- Answer common questions from a cache of approved responses.
- Run the embedding model and vector store in the same region as the agent.
- Retrieve less. Sending fewer, better chunks also cuts LLM time.
- Set a hard timeout. If retrieval misses it, the agent should say what it can or be honest that it needs a moment.

I have written more on why retrieval is a data modeling problem in [RAG is not a new engineering discipline](https://evan-cse.github.io/Evan_Shareef/writing/rag-is-not-a-new-engineering-discipline).

### Streaming and filler speech

Stream everything. Send LLM tokens to text-to-speech as complete phrases rather than waiting for a full response.

When a tool will take a while, have the agent say something honest first, such as "Let me check that booking." A short natural phrase is far better than silence, and silence on a phone call makes people ask "hello?", which then interrupts your pipeline. Avoid an identical filler phrase on every turn, because callers notice quickly.

You will also trade accuracy against speed. Waiting longer to decide that the caller finished reduces the chance of cutting them off, but adds delay to every turn. Tune this per use case, and use a semantic turn detector if silence timing alone is not good enough.

## When the pipeline fails mid-call

A web app can show an error page. A voice agent has only dead air. Things will fail in the middle of a live call, so decide what happens at each stage before they do.

| What fails | What the caller should get |
| --- | --- |
| Speech-to-text | Fail over to a second provider, or ask the caller to repeat |
| LLM timeout or error | Retry once, then use a backup model or a short scripted line |
| Text-to-speech | Fall back to another voice, even if it sounds different |
| Tool or backend | An honest message and another route, such as a callback |
| Everything | Transfer to a human, or end the call politely and follow up |

Some rules matter across all of these:

- **Set a timeout on every stage.** A stage that hangs is worse than one that fails.
- **Make tools idempotent.** If a booking call times out and retries, the caller should not get two bookings. Use an idempotency key per action.
- **Never let the agent claim success without a result.** If the tool failed, the agent must not say "you're all set".
- **Keep call state outside the worker.** If a process dies, a replacement should be able to pick up the call or at least know what happened.
- **Make human handoff a first-class path.** Pass a summary along, so the caller does not have to start over.

If a human transfer is possible, also plan for hours when nobody is available. The [common failure modes guide from Picovoice](https://picovoice.ai/guide/voice-agents/common-failure-modes/) is a useful reference for separating timing failures from state failures.

## Voice UX: what if the caller is not clear?

Real calls happen in cars, markets, and busy offices, on cheap phones and bad networks. Your test recordings do not sound like that.

### Handling unclear speech

Never let the agent guess at something important. A misheard date or amount can do real damage while sounding perfectly confident.

- Use speech-to-text confidence, and ask again when it is low.
- Confirm critical details by reading them back: "That's Tuesday the 4th at 3 PM, correct?"
- After two failed attempts, change the method. Offer keypad input, send an SMS link, or transfer the call.
- Do not repeat "Sorry, I didn't catch that" forever.
- Give the speech-to-text model hints for names, products, and domain terms.
- Test on real telephone audio. Models perform differently at telephone quality than on clean recordings.

This gets harder with languages like Bangla, where callers mix in English and spoken forms vary. I wrote about what that looks like in [the invisible characters breaking your Bangla NLP pipeline](https://evan-cse.github.io/Evan_Shareef/writing/invisible-characters-bangla-nlp).

### Writing for the ear

LLMs write for the screen. A response with bullets, markdown, or a long URL sounds terrible when read aloud.

Keep responses to a sentence or two and ask one question at a time. Normalize numbers, dates, and currency before text-to-speech, because "1/2" can be read as a fraction or a date. Test how your voice pronounces local names.

Handle silence as well. If the caller goes quiet, prompt them once or twice and then close the call gracefully.

## How to detect and prevent hallucinations in voice agents

A hallucination is worse in voice. The caller has nothing on screen to double-check, the answer sounds confident, and it may be heard as a promise from your company.

Prevent as much as you can before generation:

- Pull prices, policies, availability, and account details from tools. Do not let the model answer those from memory.
- Tell the agent to say it doesn't know, and treat that as a correct outcome.
- If retrieval finds nothing relevant, skip the model's guess and use a set response or a handoff.
- Limit what the agent is allowed to discuss.

Detection is harder because streaming audio leaves little time. A few things work:

- Check high-risk claims before speaking. Numbers, dates, and commitments can be matched against the tool results for that turn, in the time between sentences.
- Hold a sentence back when it contains a value that didn't appear in the tool output.
- Run a slower groundedness evaluation after the call, on every transcript, and review the failures.

Post-call checks will not save that call, but they will show you what to fix. Track hallucination rate as a production metric.

## Managing context in long voice conversations

Every turn adds to the context, which means more tokens, more cost, and a slower first token. Long calls also suffer when an early fact falls out of the window and the agent asks the caller to repeat themselves.

A plain summary alone is not enough. Summaries lose exact values, and an account number or a date can't be approximate. I would keep three separate things:

- **Structured state.** Verified identity, the caller's goal, and collected details such as dates and order IDs. Your code owns this, not the model.
- **Recent turns.** The last several turns, kept word for word.
- **A rolling summary.** Older conversation compressed into a short note.

Update the summary in the background so it never adds delay to a turn. Run it with a cheap, fast model, and rebuild the context from those three parts each turn.

Summaries carry their own risk. An injected instruction that gets summarized can come back looking like trusted memory. So write summaries as reported speech ("the caller asked to..."), and never let one change verified state.

Also trim large tool results before they enter the context. A full CRM record dumped into every turn is the most common waste I would look for first.

## Barge-in: what happens when the caller interrupts

Barge-in means the caller talks over the agent. Humans do it constantly, so a production voice agent must handle it.

Most people think of it as stopping the audio, but that is only half of it. There are two jobs: react quickly, then make the conversation history match what the caller actually heard.

### Why generated text must not stay in context

The LLM writes faster than the voice speaks. When the caller interrupts, the system may have generated three sentences while the caller heard one.

If those unheard sentences stay in the context, the model believes it said things the caller never heard. Suppose it had generated "Your refund is approved, and it takes five days," but the caller interrupted after "Your refund." Later, the model may refer to details the caller never got.

So when an interruption fires:

\`\`\`python
async def on_barge_in(turn: AssistantTurn):
    turn.llm_stream.cancel()
    turn.tts_stream.cancel()
    playback.flush()

    heard = turn.text_spoken_until(playback.position_ms())
    context.replace_assistant_message(turn.id, heard, interrupted=True)
\`\`\`

Good frameworks do much of this for you. [Pipecat commits only the text spoken before the interruption](https://docs.pipecat.ai/pipecat/fundamentals/interruptions) as the assistant's message. LiveKit also estimates what was played, and a [reported bug around false interruptions](https://github.com/livekit/agents/issues/5038) shows how subtle this gets. Audio-native models have the same issue: [developers reported transcripts not lining up with playback](https://community.openai.com/t/realtime-api-interruptions-dont-properly-trim-the-transcript/1000703) on OpenAI's Realtime API. Even with a framework, test this behavior yourself.

### The details that break barge-in

- **Knowing what was heard is an estimate.** Audio sent to a telephony provider is buffered before it is played. Use word timestamps from text-to-speech where you can, and expect to be off by a word or two.
- **Not every sound is an interruption.** Coughs, background voices, and "uh-huh" should not stop the agent. Require real words or a minimum duration, and use the transcript to confirm.
- **The agent can hear itself.** Without good echo cancellation, its own voice triggers a barge-in.
- **Tools can't be un-called.** If the caller interrupts after a booking started, the audio can stop but the booking may still go through. The agent must know that, and must not act as if nothing happened.
- **Stale work must die.** Each turn needs an ID, so late results from a cancelled turn are ignored.

## More production problems to plan for

A few more issues that deserve attention before launch:

- **Multilingual calls.** Callers switch languages mid-sentence, so speech-to-text, the LLM, and the voice all need to keep up.
- **Voicemail and call screening.** Outbound agents need to detect them, or they will hold a conversation with an answering machine.
- **Keypad input.** DTMF is more reliable than speech for account numbers and PINs.
- **Concurrency.** Calls are long-lived and stateful, so autoscaling and deployments need to drain workers without dropping calls.
- **Provider changes.** A model or voice update can change behavior overnight. Pin versions where you can and rerun your tests.
- **Prompt versioning.** Tie each call to the exact prompt and model that handled it, or you can't debug it later.
- **Testing.** Unit tests won't cover this. Replay real audio with noise, accents, and interruptions, and run automated simulated callers before each release.
- **Attack testing.** Speak your injection tests through the full audio pipeline. Pasting them into a text box skips speech-to-text, which is where many of the real differences appear.
- **Observability.** Log a per-turn trace with stage timings, transcript, tool calls, barge-in events, and audio, so you can replay any bad call.
- **Measuring success.** Track task completion, transfer rate, and repeat calls alongside uptime. An agent can be available and still useless.

## Production readiness checklist for voice agents

Before calling a voice agent production ready, I would want a yes to each of these:

1. Does a successful prompt injection still leave the caller unable to reach anything they shouldn't?
2. Is the system prompt free of secrets?
3. Is authorization enforced in tool code, using a server-created session?
4. Are callers verified with more than caller ID before sensitive actions?
5. Are retrieved content and transcripts treated as untrusted?
6. Is personal data redacted from logs, with a retention policy for recordings?
7. Are call length, concurrency, and tool loops capped?
8. Do you know P95 latency for each pipeline stage?
9. Does every stage have a timeout and a fallback?
10. Are tools idempotent?
11. Is there a working human handoff?
12. Are critical details read back to the caller?
13. Do prices and policies come from tools rather than model memory?
14. Are key facts stored as structured state, separate from the summary?
15. After a barge-in, does the context contain only what the caller heard?
16. Have you tested with real audio, noise, and interruptions?
17. Can you replay any call turn by turn?

## Frequently asked questions

### Why do voice AI demos fail in production?

A demo has one cooperative speaker, a quiet room, and a happy path. Production has noise, accents, interruptions, provider failures, and people testing your limits. Those conditions expose latency, reliability, and security gaps a demo never touches.

### Can prompt injection happen through voice?

Yes. Speech-to-text turns spoken instructions into text the LLM reads like any other input. Variations in transcription can also get past text filters, so authorization has to be enforced in backend code.

### What is a good latency for a voice agent?

A common target is 500 to 800 milliseconds from when the caller stops speaking to when the agent starts. Track P95 for each stage, because the slowest calls shape how the product feels.

### What is barge-in in a voice agent?

Barge-in is when a caller interrupts the agent while it is speaking. The system has to stop playback, cancel generation, and remove the unheard text from the conversation context.

### How do you stop a voice agent from hallucinating?

Fetch facts from tools, allow the agent to say it doesn't know, check high-risk values against tool results before speaking, and review transcripts for groundedness after each call.

## The bottom line

Frameworks have made voice agents easy to start, and I'm glad they have. The demo was never the hard part. The hard part is everything that happens when a real person, on a bad line, in a hurry, says something you never planned for, and some of those people will be trying to break it.

If you are building one of these or want to compare notes, [find me on LinkedIn](https://www.linkedin.com/in/evan-shareef/). You can also read how I approached a production system in my [call center analytics case study](https://evan-cse.github.io/Evan_Shareef/work/call-center-analytics).`

export const posts: Post[] = [
  {
    slug: 'voice-agents-in-production',
    title: 'Voice Agents in Production: What Demos Hide',
    description:
      'A case study on voice AI security and production problems: prompt injection, tool authorization, latency, barge-in, hallucination, and context.',
    date: '2026-10-31',
    category: 'AI Systems',
    tags: ['Voice AI', 'Security', 'Prompt injection', 'Production'],
    readingTime: readingTime(voiceAgents),
    body: voiceAgents,
  },
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
