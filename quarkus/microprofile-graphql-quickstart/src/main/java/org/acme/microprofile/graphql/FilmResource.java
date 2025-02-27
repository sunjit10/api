package org.acme.microprofile.graphql;

import io.smallrye.graphql.api.Subscription;
import io.smallrye.mutiny.Multi;
import io.smallrye.mutiny.operators.multi.processors.BroadcastProcessor;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Query;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Name;
import org.eclipse.microprofile.graphql.Description;
import org.eclipse.microprofile.graphql.DefaultValue;
import org.eclipse.microprofile.graphql.Source;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.List;

@GraphQLApi
public class FilmResource {
    
    @Inject
    GalaxyService service;
    
    @Query("allFilms") 
    @Description("Get all Films from a galaxy far far away") 
    public List<Film> getAllFilms() {
        return service.getAllFilms();
    }
    
    @Query
    @Description("Get a Film from a galaxy far far away")
    public Film getFilm(@Name("filmId") int id) {
	return service.getFilm(id);
    }
}
