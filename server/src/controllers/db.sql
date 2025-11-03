DROP TABLE IF EXISTS publicacoes, oportunidades, noticias;

CREATE TABLE noticias (
  idnoticia SERIAL,
  titulo VARCHAR(250) NULL,
  link VARCHAR(250) NULL,
  postagem DATE NULL,
  exibir BOOL NULL,
  image VARCHAR NULL,
  PRIMARY KEY(idnoticia)
);

CREATE TABLE oportunidades (
  idoportunidade SERIAL,
  titulo VARCHAR(250) NULL,
  descricao TEXT NULL,
  validade DATE NULL,
  exibir BOOL NULL,
  PRIMARY KEY(idoportunidade)
);

CREATE TABLE publicacoes (
  idpublicacao SERIAL,
  texto TEXT NULL,
  ano INTEGER NULL,
  link VARCHAR(250) NULL,
  doi VARCHAR(250) NULL,
  image VARCHAR NULL,
  PRIMARY KEY(idpublicacao)
);

