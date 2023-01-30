PGDMP     	    3                 {            bank     15.1 (Ubuntu 15.1-1.pgdg22.04+1)     15.1 (Ubuntu 15.1-1.pgdg22.04+1)     R           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            S           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            T           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            U           1262    16408    bank    DATABASE     p   CREATE DATABASE bank WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF-8';
    DROP DATABASE bank;
                alberto    false                        3079    16477    pgcrypto 	   EXTENSION     <   CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
    DROP EXTENSION pgcrypto;
                   false            V           0    0    EXTENSION pgcrypto    COMMENT     <   COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';
                        false    2            �            1259    16423 
   operations    TABLE     �   CREATE TABLE public.operations (
    id uuid NOT NULL,
    source_user character varying,
    dest_user character varying,
    amount double precision,
    type smallint,
    date date,
    token uuid
);
    DROP TABLE public.operations;
       public         heap    alberto    false            �            1259    16409    users    TABLE     �   CREATE TABLE public.users (
    id uuid NOT NULL,
    username character varying,
    password character varying,
    balance double precision
);
    DROP TABLE public.users;
       public         heap    alberto    false            O          0    16423 
   operations 
   TABLE DATA           [   COPY public.operations (id, source_user, dest_user, amount, type, date, token) FROM stdin;
    public          alberto    false    216   �       N          0    16409    users 
   TABLE DATA           @   COPY public.users (id, username, password, balance) FROM stdin;
    public          alberto    false    215   :       �           2606    16429    operations operations_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.operations
    ADD CONSTRAINT operations_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.operations DROP CONSTRAINT operations_pkey;
       public            alberto    false    216            �           2606    16422    users unsername_unique 
   CONSTRAINT     U   ALTER TABLE ONLY public.users
    ADD CONSTRAINT unsername_unique UNIQUE (username);
 @   ALTER TABLE ONLY public.users DROP CONSTRAINT unsername_unique;
       public            alberto    false    215            �           2606    16420    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            alberto    false    215            �           2606    16435    operations dest_user_username    FK CONSTRAINT     �   ALTER TABLE ONLY public.operations
    ADD CONSTRAINT dest_user_username FOREIGN KEY (dest_user) REFERENCES public.users(username);
 G   ALTER TABLE ONLY public.operations DROP CONSTRAINT dest_user_username;
       public          alberto    false    3257    216    215            �           2606    16430    operations souce_user_username    FK CONSTRAINT     �   ALTER TABLE ONLY public.operations
    ADD CONSTRAINT souce_user_username FOREIGN KEY (source_user) REFERENCES public.users(username);
 H   ALTER TABLE ONLY public.operations DROP CONSTRAINT souce_user_username;
       public          alberto    false    215    3257    216            O   a  x�u�M�l5��}�b���q6�
�Ď		�7b�T_��=��}�خ�ʭ��Ƈ��N}�S,�ts߼+Z���F�����������_�/y}���G%��$f����^�[,��/폨�)ٴ�J�ڙb�K�?c,�񣆟�ʿ�D�- ";/Z����U��sJD�c�>E;
��!��v&M�6����ޗ򋿺ߚ�Q�j�o-�q��6�ve���\3]Ȏu��7�_emO�[ߗ�w�W{�����k�D.����+�z�&zf�<���O�4K�l٠5Fnq�*��:��˝��6��Y�};�����s�&ۆ���d6)������{�Gl��́k՝��Kz\۹9��9a��5�|ZdW#r�s���G<��g+�s�9�]y��x�8{QI���	y`��8�RnI~*PY^/���@/tl
CW�o���2+7�A�*Jd`����?�e��]��z���N�������0�﻾�YA{AGࠊ,�Y�#�}���I��ídքґS����Ͼ*���aL�EۓI�Et ��GZo��b�D���fll䱡����@���Fd��S�/��T��9`o�Ec0lC(.�?>
�.m]0���6�0"��|�}*���T�4���@�A㻁&cmև�߅�sP4a�:rXR�Kw|�`ɸn�+X]0�@�sZ*�Y��<p��{�� �2��7���	�	(B|
+ UF��]�@�	ys�O/�9a���	��}�2���%����
�<����]��vOOH�6��=��{�F	91��H���6W�G��Z46��a[tB�
=���9	)V/��+�,�E ګ�9&@�?��	�[0��[,��m*5j>�~z����U      N   �   x�]�Aj1���.*�-��t#�2�&M�I)��;]5� ������ 3u��͂�QDZ����m�����?�m���Kd�؁���
F: X\5{p�j��L�\�
n�@	Z��{�j�)�����l��0) �}�e^!�Ԗǔ���ǡ��3.'�su�?�tE����6G+XpJ���ǿ�*K?��2;H�
4�,4�
��G��F9��b{<"Y�ߖe�[ c�     