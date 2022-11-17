--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Ubuntu 15.1-1.pgdg22.04+1)
-- Dumped by pg_dump version 15.1 (Ubuntu 15.1-1.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bank_users; Type: TABLE; Schema: public; Owner: bank_service
--

CREATE TABLE public.bank_users (
    id integer NOT NULL,
    name text,
    count integer,
    report text
);


ALTER TABLE public.bank_users OWNER TO bank_service;

--
-- Data for Name: bank_users; Type: TABLE DATA; Schema: public; Owner: bank_service
--

COPY public.bank_users (id, name, count, report) FROM stdin;
2	Lorenzo	1000	\N
3	Mae	830	Withdrawn 200\nDeposited 30\n
1	Alberto	610	Withdrawn 20\nWithdrawn 10\nDeposited 450\nDeposited 340\nDeposited 100\n
\.


--
-- Name: bank_users bank_users_pkey; Type: CONSTRAINT; Schema: public; Owner: bank_service
--

ALTER TABLE ONLY public.bank_users
    ADD CONSTRAINT bank_users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

