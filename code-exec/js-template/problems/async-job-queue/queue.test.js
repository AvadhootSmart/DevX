const JobQueue = require('./solution');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Async Job Queue', () => {
    test('processes single job', async () => {
        const queue = new JobQueue(1);
        const result = await queue.add(async () => {
            return 'success';
        });
        expect(result).toBe('success');
    });

    test('processes jobs concurrently', async () => {
        const queue = new JobQueue(2);
        let running = 0;
        let maxRunning = 0;

        const task = async () => {
            running++;
            maxRunning = Math.max(maxRunning, running);
            await delay(50);
            running--;
            return 'done';
        };

        await Promise.all([
            queue.add(task),
            queue.add(task),
            queue.add(task)
        ]);

        expect(maxRunning).toBe(2);
    });

    test('retries failed jobs', async () => {
        const queue = new JobQueue(1);
        let attempts = 0;

        const task = async () => {
            attempts++;
            if (attempts <= 2) {
                throw new Error('fail');
            }
            return 'success';
        };

        const result = await queue.add(task, 2);
        expect(result).toBe('success');
        expect(attempts).toBe(3); // 1st try + 2 retries
    });

    test('fails after retries exhausted', async () => {
        const queue = new JobQueue(1);
        let attempts = 0;

        const task = async () => {
            attempts++;
            throw new Error('fail');
        };

        await expect(queue.add(task, 1)).rejects.toThrow('fail');
        expect(attempts).toBe(2); // 1st try + 1 retry
    });
});
