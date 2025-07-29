import graphene
import graphql_jwt
import api.schema


#  root query inherits from our app queries
class Query(api.schema.Query, graphene.ObjectType):
    pass


# Root mutation inherits from our app mutations
# and adds the JWT mutations
class Mutation(api.schema.Mutation, graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()


# Final complete schema
schema = graphene.Schema(query=Query, mutation=Mutation)
