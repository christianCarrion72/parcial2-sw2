package com.parcial2.consul.web.graphql;

import com.parcial2.consul.web.rest.errors.EmailAlreadyUsedException;
import com.parcial2.consul.web.rest.errors.LoginAlreadyUsedException;
import graphql.GraphQLError;
import graphql.schema.DataFetchingEnvironment;
import org.springframework.graphql.execution.DataFetcherExceptionResolverAdapter;
import org.springframework.graphql.execution.ErrorType;
import org.springframework.stereotype.Component;

@Component
public class GraphQLExceptionHandler extends DataFetcherExceptionResolverAdapter {

    @Override
    protected GraphQLError resolveToSingleError(Throwable ex, DataFetchingEnvironment env) {
        if (ex instanceof EmailAlreadyUsedException) {
            return GraphQLError.newError()
                .errorType(ErrorType.BAD_REQUEST)
                .message("Email is already in use")
                .path(env.getExecutionStepInfo().getPath())
                .location(env.getField().getSourceLocation())
                .build();
        } else if (ex instanceof LoginAlreadyUsedException) {
            return GraphQLError.newError()
                .errorType(ErrorType.BAD_REQUEST)
                .message("Login is already in use")
                .path(env.getExecutionStepInfo().getPath())
                .location(env.getField().getSourceLocation())
                .build();
        }
        return super.resolveToSingleError(ex, env);
    }
}
