using System;

namespace IA.Repository.Base.Dapper.Helpers
{
    internal class QueryResult
    {
        private readonly Tuple<string, dynamic> _result;

        public string Sql
        {
            get
            {
                return _result.Item1;
            }
        }

        public dynamic Param
        {
            get
            {
                return _result.Item2;
            }
        }

        public QueryResult(string sql, dynamic param)
        {
            _result = new Tuple<string, dynamic>(sql, param);
        }
    }
}