/**
 * expand-roadmaps.js
 * Bulk-expands all roadmap JSON files with expertResources,
 * keyConceptsDeepDive, and communityAndPractice sections.
 * Run: node expand-roadmaps.js
 */

const fs = require('fs');
const path = require('path');

const ROADMAPS_DIR = path.join(__dirname, 'src/data/roadmaps');

// ---------------------------------------------------------------------------
// Role-specific overrides (used when slug matches, else falls through to generic)
// ---------------------------------------------------------------------------
const roleData = {
  'ai-engineer': {
    books: [
      { title: 'Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow', author: 'Aurelien Geron', url: 'https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/', description: 'The definitive practical guide to building ML models. Covers classical ML and deep learning with hands-on exercises and real-world examples.' },
      { title: 'Deep Learning', author: 'Goodfellow, Bengio & Courville', url: 'https://www.deeplearningbook.org/', description: 'The academic bible for deep learning. Available free online. Covers neural networks, regularization, optimization, and advanced architectures.' }
    ],
    docs: [
      { name: 'PyTorch Documentation', url: 'https://pytorch.org/docs/stable/index.html', description: 'Official PyTorch reference for tensors, autograd, neural network modules, and distributed training.' },
      { name: 'Hugging Face Documentation', url: 'https://huggingface.co/docs', description: 'The primary reference for transformer models, tokenizers, datasets, and PEFT fine-tuning techniques.' },
      { name: 'LangChain Documentation', url: 'https://python.langchain.com/', description: 'Official guide to building LLM-powered applications, chains, agents, and RAG pipelines.' }
    ],
    courses: [
      { name: 'fast.ai Practical Deep Learning', url: 'https://course.fast.ai/', platform: 'fast.ai / Free', description: 'Top-down practical approach to deep learning — highly recommended for engineers who learn better by building before theory.' },
      { name: 'DeepLearning.AI Machine Learning Specialization', url: 'https://www.coursera.org/specializations/machine-learning-introduction', platform: 'Coursera', description: "Andrew Ng's foundational ML course — the gold standard for learning supervised, unsupervised, and reinforcement learning." }
    ],
    concepts: [
      { concept: 'Transformer Architecture: How Modern AI Works', explanation: 'The Transformer architecture (introduced in "Attention Is All You Need", 2017) is the backbone of every modern LLM including GPT-4, Claude, and Gemini. It replaces recurrent networks with a self-attention mechanism that computes relationships between all tokens simultaneously. The key innovation is multi-head attention — the model learns to look at different representation subspaces of the input at different positions. Every AI Engineer must understand attention scores, positional encoding, and the feed-forward layers that follow each attention block to reason about model behavior and debug inference issues.' },
      { concept: 'RAG vs Fine-Tuning: Choosing the Right LLM Strategy', explanation: 'When building AI applications that need domain-specific knowledge, you have two primary options. RAG (Retrieval-Augmented Generation) retrieves relevant documents from a vector database at query time and injects them into the prompt — it requires no model retraining and works well when your knowledge base changes frequently. Fine-tuning adjusts the weights of a pre-trained model on a curated dataset — it produces faster inference and embeds knowledge permanently into the model. RAG excels for frequently-updated knowledge bases (product docs, policies), while fine-tuning excels for teaching the model a new task format or specialized domain where the knowledge is stable.' },
      { concept: 'Vector Databases: The Memory Layer of AI Applications', explanation: 'Vector databases store and retrieve high-dimensional embeddings — numerical representations of text, images, or audio. When a user asks a question, it is converted to an embedding vector, then the database finds the most semantically similar stored vectors using approximate nearest neighbor (ANN) search algorithms like HNSW or IVF. Popular vector databases include Pinecone, Weaviate, Chroma, and pgvector (PostgreSQL extension). The key parameters to tune are: index type (HNSW for accuracy, IVF for speed), embedding model (text-embedding-3-large vs. smaller models), and chunking strategy (how you split documents into searchable pieces — chunk size and overlap dramatically affect retrieval quality).' }
    ],
    subreddits: ['r/MachineLearning', 'r/LocalLLaMA', 'r/artificial'],
    repos: [
      { name: 'Awesome-LLM', url: 'https://github.com/Hannibal046/Awesome-LLM', description: 'Curated list of large language model papers, frameworks, fine-tuning resources, and production deployment guides.' },
      { name: 'langchain', url: 'https://github.com/langchain-ai/langchain', description: 'The primary framework for building LLM-powered applications with chains, agents, and retrieval-augmented generation.' }
    ],
    newsletters: [
      { name: 'The Batch by deeplearning.ai', url: 'https://www.deeplearning.ai/the-batch/', description: 'Weekly AI news and research summaries from Andrew Ng\'s team at deeplearning.ai.' },
      { name: 'AI Breakfast', url: 'https://aibreakfast.beehiiv.com/', description: 'Daily AI news digest covering model releases, research papers, and industry trends.' }
    ]
  },

  'devops-engineer': {
    books: [
      { title: 'The Phoenix Project', author: 'Gene Kim, Kevin Behr, George Spafford', url: 'https://itrevolution.com/product/the-phoenix-project/', description: 'A novel that teaches DevOps principles through storytelling. Essential for understanding the business case for DevOps and CI/CD adoption.' },
      { title: 'Kubernetes: Up and Running', author: 'Brendan Burns, Joe Beda, Kelsey Hightower', url: 'https://www.oreilly.com/library/view/kubernetes-up-and/9781098110192/', description: 'Written by the creators of Kubernetes. The authoritative guide to container orchestration, from basic pods to production cluster management.' }
    ],
    docs: [
      { name: 'Kubernetes Documentation', url: 'https://kubernetes.io/docs/', description: 'Official K8s reference covering pods, deployments, services, ingress, RBAC, and Helm chart management.' },
      { name: 'Terraform Documentation', url: 'https://developer.hashicorp.com/terraform/docs', description: "HashiCorp's official guide to infrastructure as code — providers, modules, state management, and workspace design." },
      { name: 'GitHub Actions Documentation', url: 'https://docs.github.com/en/actions', description: 'Complete reference for CI/CD workflows, runners, secrets management, and reusable actions.' }
    ],
    courses: [
      { name: 'DevOps Beginners to Advanced with Projects', url: 'https://www.udemy.com/course/devsecops/', platform: 'Udemy', description: 'Comprehensive course covering Linux, Docker, Kubernetes, Terraform, Ansible, and Jenkins with real project labs.' },
      { name: 'Certified Kubernetes Administrator (CKA) Prep', url: 'https://www.udemy.com/course/certified-kubernetes-administrator-with-practice-tests/', platform: 'Udemy', description: 'The most popular CKA exam prep course with browser-based practice labs from KodeKloud.' }
    ],
    concepts: [
      { concept: 'GitOps: Infrastructure as Code Meets Continuous Delivery', explanation: 'GitOps is an operational framework that treats Git as the single source of truth for both application code and infrastructure configuration. In a GitOps workflow, any change to infrastructure is made through a Git pull request. An automated reconciliation controller (like ArgoCD or Flux) continuously watches the Git repository and ensures the actual cluster state matches the desired state declared in Git. If someone makes a direct change to the cluster that does not match Git, the controller reverts it. This creates fully auditable, version-controlled infrastructure where rollbacks are simply git revert operations.' },
      { concept: 'Observability: Metrics, Logs, and Traces', explanation: 'Observability is the ability to understand the internal state of a system by examining its external outputs. Modern observability has three pillars: Metrics (quantitative time-series data from Prometheus — CPU usage, request rate, error rate, latency), Logs (structured event records from application code — use structured JSON logging with correlation IDs), and Traces (distributed request tracking across microservices using OpenTelemetry and Jaeger). The key insight is that all three must be correlated — a spike in the error rate metric should link to log lines from that time window, which should link to a distributed trace showing which microservice failed.' },
      { concept: 'Container Security: Hardening Docker and Kubernetes', explanation: 'Security in containerized environments operates at four layers. Image security: always scan images with tools like Trivy or Grype, use minimal base images (Alpine, Distroless), never run containers as root. Runtime security: use Kubernetes Pod Security Admission to enforce non-root, read-only root filesystem, and no privilege escalation. Network security: implement NetworkPolicies to restrict pod-to-pod communication — by default all pods can reach each other. Secrets management: never store secrets in environment variables or ConfigMaps — use Kubernetes Secrets with RBAC restrictions or integrate with HashiCorp Vault. The CIS Kubernetes Benchmark provides a comprehensive security checklist used by enterprises worldwide.' }
    ],
    subreddits: ['r/devops', 'r/kubernetes', 'r/aws'],
    repos: [
      { name: 'awesome-devops', url: 'https://github.com/wmariuss/awesome-devops', description: 'Curated list of DevOps tools, frameworks, platforms, and learning resources.' },
      { name: 'kubernetes-the-hard-way', url: 'https://github.com/kelseyhightower/kubernetes-the-hard-way', description: "Kelsey Hightower's legendary tutorial for bootstrapping Kubernetes from scratch — the best way to truly understand it." }
    ],
    newsletters: [
      { name: 'DevOps Weekly', url: 'https://www.devopsweekly.com/', description: 'Weekly DevOps digest covering infrastructure, CI/CD, containers, and platform engineering trends.' },
      { name: 'Last Week in AWS', url: 'https://www.lastweekinaws.com/', description: 'Opinionated weekly newsletter covering AWS announcements, cost optimization, and cloud infrastructure trends.' }
    ]
  },

  'frontend-developer': {
    books: [
      { title: "JavaScript: The Good Parts", author: 'Douglas Crockford', url: 'https://www.oreilly.com/library/view/javascript-the-good/9780596517748/', description: 'A classic that distills JavaScript to its most powerful and reliable patterns. Essential reading for understanding the language at a deeper level.' },
      { title: "You Don't Know JS (book series)", author: 'Kyle Simpson', url: 'https://github.com/getify/You-Dont-Know-JS', description: 'Free open-source deep dive into JavaScript mechanics: closures, prototypes, async, and ES6+. The most thorough JS resource available.' }
    ],
    docs: [
      { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/', description: 'The definitive reference for HTML, CSS, and JavaScript. Includes browser compatibility tables and interactive examples.' },
      { name: 'React Documentation', url: 'https://react.dev/', description: 'Official React docs covering hooks, components, state management, and performance optimization with interactive sandboxes.' },
      { name: 'web.dev by Google', url: 'https://web.dev/', description: "Google's official resource for Core Web Vitals, performance optimization, accessibility, and modern web APIs." }
    ],
    courses: [
      { name: 'The Odin Project', url: 'https://www.theodinproject.com/', platform: 'Free / Open Source', description: 'A comprehensive, completely free full-stack curriculum covering HTML, CSS, JavaScript, React, and Node.js with real projects.' },
      { name: 'Frontend Masters', url: 'https://frontendmasters.com/', platform: 'Subscription', description: 'High-quality frontend courses taught by industry experts — CSS, JavaScript performance, TypeScript, and framework deep dives.' }
    ],
    concepts: [
      { concept: 'Core Web Vitals: How Google Measures Frontend Performance', explanation: "Core Web Vitals are Google's standardized metrics for measuring real user experience — they directly impact search rankings. The three critical metrics are: LCP (Largest Contentful Paint) — how long until the main content is visible, target < 2.5s. INP (Interaction to Next Paint) — how responsive is the page to user input, target < 200ms. CLS (Cumulative Layout Shift) — how much does the layout jump unexpectedly, target < 0.1. You improve LCP by preloading hero images, using CDNs, and server-side rendering. You improve INP by breaking long JavaScript tasks using setTimeout or Web Workers. You improve CLS by always specifying width and height on images and never inserting content above existing content after load." },
      { concept: 'JavaScript Event Loop: Why Async Code Works Without Threads', explanation: 'JavaScript is single-threaded — it has one call stack that executes one operation at a time. The event loop is the mechanism that enables asynchronous code without blocking. When you call fetch() or setTimeout(), the Web API handles it outside the main thread. When it completes, the callback is placed in the task queue. The event loop checks: if the call stack is empty, it picks the next item from the microtask queue first (Promise callbacks), then the macrotask queue (setTimeout, setInterval). This is why Promise.resolve().then() always runs before setTimeout(() => {}, 0). Understanding this prevents subtle bugs in async code and helps you write non-blocking UI logic.' },
      { concept: 'CSS Architecture: BEM, CSS Modules, and CSS-in-JS', explanation: 'As applications grow, CSS becomes one of the hardest things to maintain. The root problem is that all CSS is global by default — a class name in one file can accidentally style elements in another. Three major solutions: BEM (Block Element Modifier) is a naming convention (.card, .card__header, .card--featured) that creates predictable, self-documenting classes with no tooling required. CSS Modules are file-scoped CSS files where class names are automatically hashed to prevent collisions — works with any bundler. CSS-in-JS libraries (styled-components, Emotion) generate unique class names at runtime with full JavaScript interpolation — best for highly dynamic styling. For most applications in 2026, CSS Modules or a utility-first approach (Tailwind) provides the best balance of performance and developer experience.' }
    ],
    subreddits: ['r/webdev', 'r/javascript', 'r/reactjs'],
    repos: [
      { name: 'awesome-react', url: 'https://github.com/enaqx/awesome-react', description: 'Curated list of React ecosystem tools, libraries, tutorials, and resources.' },
      { name: 'javascript-algorithms', url: 'https://github.com/trekhleb/javascript-algorithms', description: 'Algorithms and data structures implemented in JavaScript with detailed explanations.' }
    ],
    newsletters: [
      { name: 'JavaScript Weekly', url: 'https://javascriptweekly.com/', description: 'Long-running weekly roundup of JavaScript articles, tutorials, and news from the JS ecosystem.' },
      { name: 'CSS Weekly', url: 'https://css-weekly.com/', description: 'Weekly CSS articles, tutorials, tools, and experiments for frontend developers.' }
    ]
  },

  'backend-developer': {
    books: [
      { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', url: 'https://dataintensive.net/', description: 'The definitive guide to distributed systems and databases for backend engineers. Covers replication, partitioning, transactions, and consistency.' },
      { title: 'Clean Architecture', author: 'Robert C. Martin', url: 'https://www.oreilly.com/library/view/clean-architecture-a/9780134494272/', description: "Uncle Bob's guide to software structure and design. Essential for building maintainable, testable backend systems that evolve without becoming legacy code." }
    ],
    docs: [
      { name: 'Node.js Documentation', url: 'https://nodejs.org/en/docs/', description: 'Official Node.js API reference covering the event loop, streams, HTTP, file system, and worker threads.' },
      { name: 'PostgreSQL Documentation', url: 'https://www.postgresql.org/docs/', description: 'The most thorough SQL database documentation available. Explains indexing, query planning, and advanced SQL features like window functions and CTEs.' },
      { name: 'Redis Documentation', url: 'https://redis.io/docs/', description: 'Official Redis guide covering data structures, persistence, pub/sub, streams, and cluster configuration for caching and session management.' }
    ],
    courses: [
      { name: 'Node.js, Express, MongoDB & More: The Complete Bootcamp', url: 'https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/', platform: 'Udemy', description: 'The most comprehensive Node.js course: REST APIs, authentication, databases, deployment, and advanced patterns.' },
      { name: 'System Design for Interviews and Beyond', url: 'https://www.educative.io/courses/grokking-the-system-design-interview', platform: 'Educative', description: 'The industry-standard system design interview preparation course used by engineers at FAANG companies.' }
    ],
    concepts: [
      { concept: 'REST vs GraphQL: Choosing the Right API Architecture', explanation: 'REST organizes APIs around resources — each URL represents a resource and HTTP verbs define the action. REST is simple, cacheable, and stateless. GraphQL is a query language where the client specifies exactly what data it needs in a single request — eliminating over-fetching and under-fetching. GraphQL excels for mobile apps, complex nested data, and rapid frontend iteration. REST excels for simple CRUD operations, public APIs, and when HTTP caching is critical. Most production backends support both.' },
      { concept: 'Database Indexing: How Queries Go From 10s to 10ms', explanation: 'A database index is a separate B-tree data structure that stores a sorted copy of columns alongside pointers to table rows. Without an index, a WHERE clause query requires a full table scan. With an index, the database binary-searches the B-tree in milliseconds. Indexes have costs: they consume disk space and every write must update all relevant indexes. Key rules: always index foreign key columns, columns used in WHERE/JOIN/ORDER BY clauses, and use EXPLAIN ANALYZE to verify queries actually use the index.' },
      { concept: 'Caching Strategies: Read-Through, Write-Through, Cache-Aside', explanation: 'Caching is the most impactful backend performance optimization. Three main patterns: Cache-Aside (lazy loading) — the application checks the cache first; on a miss, fetches from the database and populates the cache. This is the most flexible pattern. Write-Through — writes go to both cache and database simultaneously, keeping them always in sync but with higher write latency. Write-Behind (write-back) — writes go to cache immediately and asynchronously sync to the database — highest write performance but risk of data loss on cache failure. The hardest problem in caching is cache invalidation: when to expire stale data. Use TTL (time-to-live) for data that can tolerate some staleness, and event-driven invalidation for data that must be immediately consistent.' }
    ],
    subreddits: ['r/node', 'r/webdev', 'r/programming'],
    repos: [
      { name: 'awesome-nodejs', url: 'https://github.com/sindresorhus/awesome-nodejs', description: 'Curated list of delightful Node.js packages and resources.' },
      { name: 'system-design-primer', url: 'https://github.com/donnemartin/system-design-primer', description: 'Learn how to design large-scale distributed systems. The most starred system design learning resource on GitHub.' }
    ],
    newsletters: [
      { name: 'Node Weekly', url: 'https://nodeweekly.com/', description: 'Weekly roundup of Node.js articles, tutorials, and news from the Node.js ecosystem.' },
      { name: 'DB Weekly', url: 'https://dbweekly.com/', description: 'Weekly database newsletter covering SQL, NoSQL, NewSQL, and data storage technologies.' }
    ]
  },

  'machine-learning-engineer': {
    books: [
      { title: 'Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow', author: 'Aurelien Geron', url: 'https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/', description: 'The definitive practical ML guide. Covers classical algorithms, neural networks, CNNs, RNNs, and deployment strategies.' },
      { title: 'Machine Learning Engineering', author: 'Andriy Burkov', url: 'http://www.mlebook.com/', description: 'Focuses on the engineering side of ML — data collection, feature engineering, model deployment, monitoring, and MLOps. Available free online.' }
    ],
    docs: [
      { name: 'scikit-learn Documentation', url: 'https://scikit-learn.org/stable/documentation.html', description: 'Official scikit-learn reference for classical ML algorithms, preprocessing, model selection, and evaluation metrics.' },
      { name: 'PyTorch Documentation', url: 'https://pytorch.org/docs/stable/index.html', description: 'Official PyTorch reference for tensors, autograd, neural network modules, and distributed training.' },
      { name: 'MLflow Documentation', url: 'https://mlflow.org/docs/latest/index.html', description: 'Official guide for ML experiment tracking, model registry, and deployment lifecycle management.' }
    ],
    courses: [
      { name: 'fast.ai Practical Deep Learning for Coders', url: 'https://course.fast.ai/', platform: 'Free', description: 'Top-down practical approach to deep learning. Highly recommended for engineers learning applied AI.' },
      { name: 'Machine Learning Engineering for Production (MLOps)', url: 'https://www.coursera.org/specializations/machine-learning-engineering-for-production-mlops', platform: 'Coursera', description: "DeepLearning.AI's MLOps specialization covering data pipelines, training, deployment, and monitoring in production." }
    ],
    concepts: [
      { concept: 'MLOps: Taking Models from Notebook to Production', explanation: 'MLOps (Machine Learning Operations) is the discipline of productionizing ML models reliably and repeatably. The ML lifecycle has 4 phases that must all be automated: Data — versioning datasets (DVC), validating data quality (Great Expectations), and monitoring for data drift. Training — experiment tracking (MLflow, W&B), hyperparameter optimization (Optuna), and reproducible pipelines (Metaflow, Kubeflow). Deployment — model serving (FastAPI, TorchServe, SageMaker), A/B testing, and canary deployments. Monitoring — tracking model accuracy over time, detecting concept drift (when real-world distributions shift from training data), and triggering automated retraining.' },
      { concept: 'Feature Engineering: The Highest-ROI Skill in ML', explanation: 'Studies consistently show that feature quality matters more than algorithm choice. Key techniques: Normalization/Standardization (scaling numerical features prevents any single feature from dominating gradient descent), One-Hot Encoding (converting categorical variables into binary columns), Target Encoding (replacing a categorical variable with the mean target value — powerful but prone to data leakage if not done carefully), and Temporal Features (extracting hour, day-of-week, is_holiday from timestamps for time-series tasks). The best feature engineers deeply understand the business domain and can identify which raw signals are most predictive of the outcome.' },
      { concept: 'Model Evaluation Beyond Accuracy', explanation: 'Accuracy is one of the most misleading model evaluation metrics — a model that predicts "no fraud" 100% of the time achieves 99.9% accuracy on a fraud dataset where 0.1% of transactions are fraudulent. Better metrics depend on your problem: Precision (of all positive predictions, how many were correct — optimize when false positives are expensive), Recall (of all actual positives, how many did you catch — optimize when false negatives are expensive), F1-Score (harmonic mean of precision and recall), ROC-AUC (model discrimination ability across all classification thresholds), and for regression: MAE, RMSE, and MAPE each have different sensitivity to outliers. Always evaluate on a held-out test set and use cross-validation to get stable estimates.' }
    ],
    subreddits: ['r/MachineLearning', 'r/mlops', 'r/learnmachinelearning'],
    repos: [
      { name: 'awesome-mlops', url: 'https://github.com/visenger/awesome-mlops', description: 'Curated list of MLOps tools, platforms, papers, and learning resources.' },
      { name: 'ml-fundamentals', url: 'https://github.com/ageron/handson-ml3', description: 'Official companion code repository for Hands-On Machine Learning — all notebooks ready to run in Google Colab.' }
    ],
    newsletters: [
      { name: 'The Batch by deeplearning.ai', url: 'https://www.deeplearning.ai/the-batch/', description: 'Weekly AI news and research summaries from Andrew Ng\'s team.' },
      { name: 'Import AI', url: 'https://jack-clark.net/', description: "Jack Clark's weekly newsletter covering the most important AI research papers and industry developments." }
    ]
  },

  'software-engineer': {
    books: [
      { title: 'Clean Code', author: 'Robert C. Martin', url: 'https://www.oreilly.com/library/view/clean-code-a/9780136083238/', description: 'The classic guide to writing readable, maintainable, and professional code. Essential for every software engineer regardless of specialization.' },
      { title: 'The Pragmatic Programmer', author: 'David Thomas & Andrew Hunt', url: 'https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/', description: 'Timeless advice on software craftsmanship, career development, and becoming a better programmer.' }
    ],
    docs: [
      { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/', description: 'The authoritative reference for web technologies. Includes browser compatibility tables and interactive examples for every API.' },
      { name: 'GitHub Docs', url: 'https://docs.github.com/', description: 'Official GitHub documentation covering pull requests, Actions CI/CD, code review workflows, and project management.' }
    ],
    courses: [
      { name: 'CS50x: Introduction to Computer Science', url: 'https://cs50.harvard.edu/x/', platform: 'Harvard / Free', description: "Harvard's famous introductory CS course. The best free starting point for understanding algorithms, data structures, and computer systems." },
      { name: 'Grokking the Coding Interview', url: 'https://www.educative.io/courses/grokking-coding-interview-patterns', platform: 'Educative', description: 'Pattern-based approach to coding interview problems. Teaches 20 reusable patterns that solve 80% of interview questions.' }
    ],
    concepts: [
      { concept: 'System Design: Architecting Scalable Software', explanation: 'System design is the process of defining architecture components, APIs, and data flow to satisfy functional and non-functional requirements. The core framework: (1) Clarify requirements and scale. (2) Estimate capacity with back-of-envelope calculations. (3) Define the API surface. (4) Design the database schema. (5) Design the high-level architecture — load balancers, app servers, caches, queues, databases. (6) Identify bottlenecks and how you address them at 10x scale. Common patterns: cache hot data with Redis, fan-out writes for social feeds, consistent hashing for distributed caching, and event-driven architecture for decoupled services.' },
      { concept: 'Data Structures That Actually Matter in Production', explanation: 'Beyond arrays and linked lists, the data structures that most frequently appear in production code: Hash Maps (O(1) average lookup — used everywhere for caching, deduplication, and grouping). Heaps (O(log n) insert/extract-min — used in priority queues, scheduling, and top-k element problems). Tries (prefix tree — used in autocomplete, spell-checking, and IP routing). Bloom Filters (probabilistic set membership — used by databases like Cassandra and Redis to avoid expensive disk lookups for non-existent keys). Skip Lists (used by Redis for sorted sets — O(log n) search with simpler implementation than balanced BSTs). LRU Cache (doubly-linked list + hash map — the most common interview question in system design).' },
      { concept: 'SOLID Principles: Writing Code That Does Not Break', explanation: 'SOLID is an acronym for five object-oriented design principles that produce software that is easy to maintain, extend, and test. Single Responsibility: each class/function has one reason to change. Open/Closed: open for extension, closed for modification — add new behavior without editing existing code. Liskov Substitution: subclasses must be substitutable for their base classes without breaking the program. Interface Segregation: clients should not depend on interfaces they do not use — prefer many small interfaces over one large one. Dependency Inversion: depend on abstractions, not concretions — high-level modules should not depend on low-level modules. In practice, SOLID prevents the two most common forms of code rot: tight coupling (changes cascade everywhere) and code duplication (the same logic in 10 places that all diverge over time).' }
    ],
    subreddits: ['r/cscareerquestions', 'r/programming', 'r/softwareengineering'],
    repos: [
      { name: 'coding-interview-university', url: 'https://github.com/jwasham/coding-interview-university', description: "John Washam's complete computer science study plan for becoming a software engineer at top tech companies." },
      { name: 'system-design-primer', url: 'https://github.com/donnemartin/system-design-primer', description: 'Learn how to design large-scale distributed systems. The most starred system design resource on GitHub.' }
    ],
    newsletters: [
      { name: 'TLDR Newsletter', url: 'https://tldr.tech/', description: 'Daily 5-minute digest of the most important tech news, developer tools, and industry updates.' },
      { name: 'Pragmatic Engineer', url: 'https://newsletter.pragmaticengineer.com/', description: "Gergely Orosz's newsletter on software engineering careers, engineering culture, and technical depth at top companies." }
    ]
  }
};

// ---------------------------------------------------------------------------
// Generic fallbacks for roles without specific entries
// ---------------------------------------------------------------------------
const genericData = {
  books: [
    { title: 'Clean Code', author: 'Robert C. Martin', url: 'https://www.oreilly.com/library/view/clean-code-a/9780136083238/', description: 'The classic guide to writing readable, maintainable, and professional code. Essential for every software engineer regardless of specialization.' },
    { title: 'The Pragmatic Programmer', author: 'David Thomas & Andrew Hunt', url: 'https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/', description: 'Timeless advice on software craftsmanship, career development, and becoming a better programmer. Covers everything from coding to career strategy.' }
  ],
  docs: [
    { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/', description: 'The authoritative reference for web technologies, JavaScript, HTML, and CSS. Maintained by Mozilla with browser compatibility data.' },
    { name: 'GitHub Documentation', url: 'https://docs.github.com/', description: 'Official GitHub docs covering pull requests, Actions CI/CD, code review workflows, and project management.' }
  ],
  courses: [
    { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org/', platform: 'Free', description: 'Free, comprehensive coding curriculum covering web development, data structures, algorithms, and certifications.' },
    { name: 'CS50x by Harvard', url: 'https://cs50.harvard.edu/x/', platform: 'edX / Free', description: "Harvard's famous introductory CS course — the best free starting point for understanding algorithms, data structures, and computer systems." }
  ],
  concepts: [
    {
      concept: 'How to Build a Portfolio That Gets You Hired',
      explanation: 'A portfolio is your most powerful tool for landing a tech job. Recruiters spend under 30 seconds reviewing a portfolio, so impact and clarity beat quantity. Build 2-3 substantial projects rather than 10 toy apps. Each project should demonstrate end-to-end ownership. Document each with a clear README explaining the problem solved, the technical decisions made and why, and quantified results. Host live demos — a working URL is worth 10 GitHub repos. Add a personal website listing your projects, skills, and a short bio. Use consistent GitHub activity to show coding habits.'
    },
    {
      concept: 'Reading Job Descriptions Like a Hiring Manager',
      explanation: 'Most job seekers self-disqualify by treating job descriptions as rigid checklists. Research shows that hiring managers expect candidates who meet 60-70% of requirements. The real signals: the first 3 bullets are the actual must-haves. "Experience with" means practitioner. "Familiarity with" means open to learners. The tech stack mentioned most frequently is what you will use daily. Tailor your resume to use exact keywords from the job description — ATS systems score resumes by keyword overlap with the job posting.'
    },
    {
      concept: 'Technical Interview Preparation: A Systematic Approach',
      explanation: 'Technical interviews test four areas: coding (data structures and algorithms), system design (architecting scalable systems), behavioral (past experiences using the STAR method), and domain knowledge (role-specific concepts). For coding: solve 75-100 LeetCode problems focusing on patterns (sliding window, two pointers, DFS/BFS, dynamic programming). For system design: practice designing 10-15 classic systems (URL shortener, Twitter feed, distributed cache). For behavioral: prepare 5-7 strong stories using STAR format that demonstrate leadership, conflict resolution, technical decision-making, and failure/learning. For domain: review fundamentals of your target role using structured roadmaps and practice explaining concepts out loud.'
    }
  ],
  subreddits: ['r/cscareerquestions', 'r/programming', 'r/learnprogramming'],
  repos: [
    { name: 'awesome', url: 'https://github.com/sindresorhus/awesome', description: 'The master list of awesome lists for every programming topic, framework, and technology.' },
    { name: 'coding-interview-university', url: 'https://github.com/jwasham/coding-interview-university', description: "John Washam's complete computer science study plan for becoming a software engineer at top companies." }
  ],
  newsletters: [
    { name: 'TLDR Newsletter', url: 'https://tldr.tech/', description: 'Daily 5-minute digest of the most important tech news, developer tools, and industry updates.' },
    { name: 'Hacker Newsletter', url: 'https://hackernewsletter.com/', description: 'Weekly curation of the best links from Hacker News — essential for staying current in tech.' }
  ]
};

// ---------------------------------------------------------------------------
// Main expansion loop
// ---------------------------------------------------------------------------
const files = fs.readdirSync(ROADMAPS_DIR).filter(f => f.endsWith('.json'));
let expanded = 0;
let skipped = 0;

files.forEach(filename => {
  const filePath = path.join(ROADMAPS_DIR, filename);
  const slug = filename.replace('.json', '');
  
  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    console.log('  ERROR parsing:', slug, e.message);
    return;
  }
  
  if (data.expertResources) {
    console.log('  SKIP (already expanded):', slug);
    skipped++;
    return;
  }

  const specific = roleData[slug] || {};
  
  data.expertResources = {
    books: specific.books || genericData.books,
    officialDocs: specific.docs || genericData.docs,
    freeCourses: specific.courses || genericData.courses
  };

  data.keyConceptsDeepDive = specific.concepts || genericData.concepts;

  data.communityAndPractice = {
    subreddits: (specific.subreddits || genericData.subreddits).map((name, i) => ({
      name: name,
      url: 'https://www.reddit.com/r/' + name.replace(/^r\//, ''),
      description: 'Active community for ' + slug.replace(/-/g, ' ') + ' professionals — career advice, tool comparisons, and industry trends.'
    })),
    githubRepos: specific.repos || genericData.repos,
    newsletters: specific.newsletters || genericData.newsletters,
    practiceProjects: [
      'Build a fully functional clone of a real product relevant to your role — constraints force creative problem solving and demonstrate practical skill.',
      'Contribute to an open-source project — even fixing documentation demonstrates professional collaboration skills and gets your name in production codebases.',
      'Solve 50+ LeetCode problems at Easy and Medium difficulty to prepare for technical interviews at top companies.',
      'Write a technical blog post about a project you built — teaching a concept solidifies your understanding and demonstrates expertise to recruiters.',
      'Complete a 30-day challenge: ship one complete mini-project every week for a month to develop consistent production habits.'
    ]
  };

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log('  EXPANDED:', slug);
  expanded++;
});

console.log('\nDone! Expanded:', expanded, '| Skipped (already done):', skipped);
