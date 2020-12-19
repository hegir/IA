namespace IA.Repository.Base.Dapper.Helpers
{
    internal class QueryParameter
    {
        public string LinkingOperator { get; set; }
        public string PropertyName { get; set; }
        public object PropertyValue { get; set; }
        public string QueryOperator { get; set; }

        internal QueryParameter(string linkingOperator, string propertyName, object propertyValue, string queryOperator)
        {
            LinkingOperator = linkingOperator;
            PropertyName = propertyName;
            PropertyValue = propertyValue;
            QueryOperator = queryOperator;
        }
    }
}