create extension if not exists vector with schema extensions;

create table documents (
  id bigserial primary key,
  content text not null,
  metadata jsonb default '{}',
  embedding vector(1536)
);

create index on documents
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

create or replace function match_documents(
  query_embedding vector(1536),
  match_threshold float default 0.7,
  match_count int default 5
) returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
) language plpgsql as $$
begin
  return query
  select
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) > match_threshold
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;
