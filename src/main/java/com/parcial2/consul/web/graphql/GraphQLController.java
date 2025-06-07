package com.parcial2.consul.web.graphql;

import graphql.ExecutionInput;
import graphql.ExecutionResult;
import graphql.GraphQL;
import graphql.schema.GraphQLSchema;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.execution.GraphQlSource;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class GraphQLController {

    private final GraphQlSource graphQlSource;

    @Autowired
    public GraphQLController(GraphQlSource graphQlSource) {
        this.graphQlSource = graphQlSource;
    }

    @PostMapping(value = "/graphql", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> handleGraphQLRequest(@RequestBody Map<String, Object> request) {
        String query = (String) request.get("query");
        Map<String, Object> variables = (Map<String, Object>) request.getOrDefault("variables", Map.of());
        String operationName = (String) request.get("operationName");

        GraphQL graphQL = GraphQL.newGraphQL(graphQlSource.schema()).build();

        ExecutionInput executionInput = ExecutionInput.newExecutionInput()
            .query(query)
            .variables(variables)
            .operationName(operationName)
            .build();

        ExecutionResult executionResult = graphQL.execute(executionInput);
        return executionResult.toSpecification();
    }
}
