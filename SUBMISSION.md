# Submission

## Implementation Notes

I approached this by keeping the architecture simple and making the boundary between the backend and frontend responsibilities very clear.

On the backend, the Go service loads the claims dataset from `data/claims.json` when the service starts and keeps it in memory. From there it exposes two endpoints: one for retrieving claims and another for retrieving summary metrics. Both endpoints support filtering through query parameters like status, provider, claim type, network status, plan name, date range, and flagged claims. The filtering and aggregation logic lives in the service layer so the API owns the data logic and the frontend can stay focused on rendering the dashboard. Structuring it this way keeps the data access patterns centralized and avoids duplicating business logic in the UI, which becomes more important as the system grows.

The Go code is split by responsibility so things stay easy to follow:

* `models` contains the claim and summary types
* `services` handles filtering and aggregation logic
* `handlers` handles query parsing and HTTP responses

On the frontend, I built a small dashboard using Next.js and Tailwind. The `ClaimsDashboard` component owns the filter state and triggers API calls whenever filters change. The UI is broken down into a few focused components so the responsibilities stay clear:

* `ClaimsDashboard` manages state and data fetching
* `ClaimsFilters` renders filter controls
* `ClaimsTable` renders the claims data
* `MetricCard` displays the summary metrics

The frontend talks to the Go API using the `/go-api/*` rewrite path defined in `next.config.ts`. Whenever filters change, the dashboard fetches both the filtered claims and the corresponding summary metrics.

I also added request cancellation in the dashboard fetch logic to prevent stale responses from overwriting newer results if filters change quickly.

Overall my goal was to build something that feels like a practical internal admin tool where someone can quickly explore claim activity and identify issues.

---

## Tradeoffs

Given the time constraint, I focused on building a clear end-to-end solution rather than trying to add a lot of additional features.

For example, the Go service loads the dataset into memory from a JSON file rather than introducing a database layer. That keeps the implementation simple while still demonstrating how filtering and aggregation would work in a real API.

On the frontend, I kept the UI relatively minimal and focused on readability and usability rather than visual polish. I also avoided introducing additional dependencies like charting libraries so the code stays smaller and easier to review.

I also chose not to add table sorting, pagination, or more advanced analytics views so I could keep the implementation focused on the core dashboard functionality.

---

## What You Would Build Next

With more time, I would focus on improving both scalability and the administrator experience.

On the data side, the claims data would normally live in a database rather than a static JSON file. The filtering logic would map to indexed queries so the system can handle larger datasets efficiently. The API surface could remain the same while the storage layer evolves, which helps keep the frontend stable as the system scales.

On the UI side, I would add table sorting and pagination so administrators can explore larger datasets more easily. I would also likely add a few lightweight charts showing things like claim status distribution or claim volume over time since those trends can help surface issues faster.

I would also add automated tests around the filtering and aggregation logic in the Go service and basic frontend tests to validate the dashboard behavior.

---

## AI Usage

I used AI tools (Cursor and ChatGPT) as development assistants while working through the exercise.

They were most helpful for speeding up boilerplate code, reviewing parts of the Go implementation since I have not worked in Go recently, and helping reason through some implementation details during development.

All generated code was reviewed and adjusted by me before being included in the final solution. I also manually tested the API endpoints and dashboard behavior to make sure filtering and summary calculations worked as expected.