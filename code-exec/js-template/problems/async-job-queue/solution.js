class JobQueue {
    constructor(concurrency = 1) {
        this.concurrency = concurrency;
        this.queue = [];
        this.activeCount = 0;
    }

    add(task, retries = 0) {
        return new Promise((resolve, reject) => {
            this.queue.push({ task, retries, resolve, reject });
            this.process();
        });
    }

    async process() {
        if (this.activeCount >= this.concurrency || this.queue.length === 0) {
            return;
        }

        this.activeCount++;
        const job = this.queue.shift();

        try {
            const result = await job.task();
            job.resolve(result);
        } catch (error) {
            if (job.retries > 0) {
                // Enqueue again with decremented retries
                console.log(`Retrying job... attempts left: ${job.retries}`);
                this.add(() => job.task(), job.retries - 1)
                    .then(job.resolve)
                    .catch(job.reject);
                // Note: In a real system, we might push back to queue directly to preserve resolve/reject context simpler,
                // but calling add again works if we chain properly.
                // Better simple solution:
            } else {
                job.reject(error);
            }
        } finally {
            this.activeCount--;
            this.process();
        }
    }
}

// Improved solution for clarity and correctness on re-queueing without losing the original promise reference
class JobQueueSolution {
    constructor(concurrency = 1) {
        this.concurrency = concurrency;
        this.queue = [];
        this.activeCount = 0;
    }

    add(task, retries = 0) {
        return new Promise((resolve, reject) => {
            this.queue.push({ task, retries, resolve, reject });
            this.process();
        });
    }

    async process() {
        if (this.activeCount >= this.concurrency || this.queue.length === 0) {
            return;
        }

        this.activeCount++;
        const job = this.queue.shift();

        try {
            const result = await job.task();
            job.resolve(result);
        } catch (error) {
            if (job.retries > 0) {
                // Determine strategy: immediate retry or push to back?
                // Push to back is safer for concurrency.
                this.queue.push({
                    task: job.task,
                    retries: job.retries - 1,
                    resolve: job.resolve,
                    reject: job.reject
                });
            } else {
                job.reject(error);
            }
        } finally {
            this.activeCount--;
            this.process(); // Trigger next job
        }
    }
}

module.exports = JobQueueSolution;
