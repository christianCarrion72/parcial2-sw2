package com.parcial2.consul.config;

import graphql.ExecutionInput;
import graphql.ExecutionResult;
import graphql.GraphQL;
import java.util.Map;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.graphql.execution.GraphQlSource;
import org.springframework.graphql.execution.RuntimeWiringConfigurer;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.RouterFunctions;
import org.springframework.web.servlet.function.ServerResponse;

@Configuration
public class GraphQLConfiguration {

    @Bean
    public RuntimeWiringConfigurer runtimeWiringConfigurer() {
        return wiringBuilder -> {
            // Aquí puedes configurar tipos personalizados, directivas, etc.
        };
    }

    @Bean
    public RouterFunction<ServerResponse> graphqlPostEndpoint(GraphQlSource graphQlSource) {
        return RouterFunctions.route()
            .POST("/graphql", request -> {
                Map<String, Object> body = request.body(Map.class);
                String query = (String) body.get("query");
                Map<String, Object> variables = (Map<String, Object>) body.getOrDefault("variables", Map.of());
                String operationName = (String) body.get("operationName");

                GraphQL graphQL = GraphQL.newGraphQL(graphQlSource.schema()).build();

                ExecutionInput executionInput = ExecutionInput.newExecutionInput()
                    .query(query)
                    .variables(variables)
                    .operationName(operationName)
                    .build();

                ExecutionResult executionResult = graphQL.execute(executionInput);
                return ServerResponse.ok().contentType(MediaType.APPLICATION_JSON).body(executionResult.toSpecification());
            })
            .build();
    }
}
