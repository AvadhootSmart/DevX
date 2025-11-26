FROM node:20-slim

# install pnpm globally
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# install jq (for summarizing JSON output)
RUN apt-get update && apt-get install -y jq && rm -rf /var/lib/apt/lists/*

# create non-root user
RUN useradd -m runner && mkdir -p /sandbox && chown runner:runner /sandbox
USER runner

RUN echo $UID

WORKDIR /sandbox
CMD ["bash"]
