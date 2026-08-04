
### localhost
```
docker compose up -d --build
```

## Em Produção

### criar os containers
```
docker compose -f docker-compose.prod.yml up -d
```

## No Servidor Caso de alterar arquivos rodar novamente o build

### front
```
docker compose -f docker-compose.prod.yml up -d --build frontend
```

### back
```
docker compose -f docker-compose.prod.yml up -d --build backend
```

### recriar tudo
```
docker compose -f docker-compose.prod.yml up -d --build
```



cleitomar.rodrigues@cafazcorretora.org.br

teste@teste.com