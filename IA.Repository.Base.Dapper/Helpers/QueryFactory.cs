using Dapper;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace IA.Repository.Base.Dapper.Helpers
{
    internal sealed class QueryFactory
    {
        public static CommandDefinition GetQuery<T, TOrder>(Expression<Func<T, bool>> expression = null, int? limit = null, int? offset = null, bool descending = false, params Expression<Func<T, TOrder>>[] orderBys)
        {
            string tableName = MembersHelper.Instance.GetTableName(typeof(T));
            var queryProperties = new List<QueryParameter>();

            var body = expression != null ? (BinaryExpression)expression.Body : null;
            IDictionary<string, object> expando = new ExpandoObject();
            var builder = new StringBuilder();

            // walk the tree and build up a list of query parameter objects
            // from the left and right branches of the expression tree
            if(body != null)
                WalkTree(body, ExpressionType.Default, ref queryProperties);

            // convert the query parms into a SQL string and dynamic property object

            var formatedColumnNames = MembersHelper.Instance.GetColumnsFormated<T>();

            builder.Append($"SELECT {formatedColumnNames} FROM ");
            builder.Append(tableName);

            if (queryProperties.Count > 0)
                builder.Append(" WHERE ");

            for (int i = 0; i < queryProperties.Count(); i++)
            {
                QueryParameter item = queryProperties[i];

                string propertyName = item.PropertyName;
                if (expando.ContainsKey(propertyName))
                    propertyName = string.Format("{0}{1}", propertyName, i);

                if (!string.IsNullOrEmpty(item.LinkingOperator) && i > 0)
                {
                    builder.Append(string.Format("{0} {1}.{2} {3} @{4} ", item.LinkingOperator, tableName, item.PropertyName, item.QueryOperator, propertyName));
                }
                else
                {
                    builder.Append(string.Format("{0}.{1} {2} @{3} ", tableName, item.PropertyName, item.QueryOperator, propertyName));
                }

                expando[propertyName] = item.PropertyValue;
            }

            if (orderBys != null && orderBys.Length > 0)
            {
                List<string> columns = new List<string>();
                foreach (Expression<Func<T, TOrder>> orderBy in orderBys)
                {
                    MemberExpression orderItem;

                    UnaryExpression unaryExpression = orderBy.Body as UnaryExpression;
                    if (unaryExpression != null)
                    {
                        UnaryExpression orderByBody = unaryExpression;
                        orderItem = (MemberExpression)orderByBody.Operand;
                    }
                    else
                    {
                        orderItem = (MemberExpression)orderBy.Body;
                    }

                    columns.Add($"{tableName}.{ MembersHelper.Instance.GetColumnName(orderItem.Member)}");
                }

                if (columns.Count > 0)
                {
                    builder.Append(string.Format(" ORDER BY ({0})", string.Join(", ", columns)));

                    if (descending)
                        builder.Append(" DESC");
                }
            }

            if (limit.HasValue)
                builder.Append(string.Format(" LIMIT {0}", limit));

            if (offset.HasValue)
                builder.Append(string.Format(" OFFSET {0}", offset));

            return new CommandDefinition(builder.ToString().TrimEnd(), BuildDynamicParameters(expando));
        }

        private static void WalkTree(BinaryExpression body, ExpressionType linkingType, ref List<QueryParameter> queryProperties)
        {
            if (body.NodeType != ExpressionType.AndAlso && body.NodeType != ExpressionType.OrElse)
            {
                object propertyValue = Expression.Lambda(body.Right).Compile().DynamicInvoke();
                queryProperties.Add(new QueryParameter(GetOperator(linkingType), GetPropertyName(body), propertyValue, GetOperator(body.NodeType)));
            }
            else
            {
                WalkTree((BinaryExpression)body.Left, body.NodeType, ref queryProperties);
                WalkTree((BinaryExpression)body.Right, body.NodeType, ref queryProperties);
            }
        }

        private static string GetPropertyName(BinaryExpression body)
        {
            MemberExpression expression;
            dynamic property = body.Left;
            bool existOperand = false;
            if (body.NodeType == ExpressionType.Equal || body.NodeType == ExpressionType.NotEqual)
            {
                Type typeOfProperty = property.GetType();
                existOperand = typeOfProperty.GetProperties().Where(p => p.Name.Equals("Operand")).Any();
            }
            if (existOperand)
            {
                expression = property.Operand as MemberExpression;
            }
            else
            {
                expression = property as MemberExpression;
            }

            string propertyName = MembersHelper.Instance.GetColumnName(expression.Member);

            if (body.Left.NodeType == ExpressionType.Convert)
            {
                propertyName = propertyName.Replace(")", string.Empty);
            }

            return propertyName;
        }

        private static DynamicParameters BuildDynamicParameters(IDictionary<string, object> dictionary)
        {
            DynamicParameters parameters = new DynamicParameters();
            foreach (var item in dictionary)
            {
                if (item.Value is DateTime)
                    parameters.Add($"@{item.Key}", item.Value, System.Data.DbType.DateTime2);
                else
                    parameters.Add($"@{item.Key}", item.Value);
            }
            return parameters;
        }

        private static string GetOperator(ExpressionType type)
        {
            switch (type)
            {
                case ExpressionType.Equal:
                    return "=";
                case ExpressionType.NotEqual:
                    return "!=";
                case ExpressionType.LessThan:
                    return "<";
                case ExpressionType.LessThanOrEqual:
                    return "<=";
                case ExpressionType.GreaterThan:
                    return ">";
                case ExpressionType.GreaterThanOrEqual:
                    return ">=";
                case ExpressionType.AndAlso:
                case ExpressionType.And:
                    return "AND";
                case ExpressionType.Or:
                case ExpressionType.OrElse:
                    return "OR";
                case ExpressionType.Default:
                    return string.Empty;
                default:
                    throw new NotImplementedException();
            }
        }
    }
}