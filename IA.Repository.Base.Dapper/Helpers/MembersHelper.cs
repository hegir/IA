using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Reflection;

namespace IA.Repository.Base.Dapper.Helpers
{
    internal class MembersHelper
    {
        private static MembersHelper _instance;
        private static readonly object Lock = new object();

        internal static MembersHelper Instance
        {
            get
            {
                if (_instance == null)
                {
                    lock (Lock)
                    {
                        if (_instance == null)
                            _instance = new MembersHelper();
                    }
                }

                return _instance;
            }
        }

        private readonly Dictionary<MemberInfo, PropertyInfo> _properties = new Dictionary<MemberInfo, PropertyInfo>();
        private readonly Dictionary<MemberInfo, string> _members = new Dictionary<MemberInfo, string>();
        private readonly Dictionary<Type, string> _tables = new Dictionary<Type, string>();
        private readonly Dictionary<string, MethodInfo> _methods = new Dictionary<string, MethodInfo>();
        private readonly Dictionary<string, List<ColumnMember>> _columns = new Dictionary<string, List<ColumnMember>>();

        internal PropertyInfo GetPropertyInfo(MemberInfo info)
        {
            lock (_properties)
            {
                if (!_properties.ContainsKey(info))
                {
                    _properties[info] = info as PropertyInfo;
                }
                return _properties[info];
            }
        }

        internal string GetColumnName(MemberInfo info)
        {
            lock (_members)
            {
                if (!_members.ContainsKey(info))
                {
                    ColumnAttribute columnAttribute = (ColumnAttribute)info.GetCustomAttribute(typeof(ColumnAttribute));
                    if (columnAttribute == null)
                        throw new Exception("Column attribute not exist");

                    _members[info] = columnAttribute.Name;
                }
                return _members[info];
            }
        }

        internal string GetTableName(Type type)
        {
            lock (_tables)
            {
                if (!_tables.ContainsKey(type))
                {
                    TableAttribute tableAttribute = (TableAttribute)type.GetCustomAttributes(typeof(TableAttribute), false).First();
                    if (tableAttribute == null)
                        throw new Exception("Table attribute not exist");

                    _tables[type] = tableAttribute.Name;
                }
                return _tables[type];
            }
        }

        internal List<ColumnMember> GetColumns<T>()
        {
            string tableName = GetTableName(typeof(T));
            lock (_columns)
            {
                if (!_columns.ContainsKey(tableName))
                {
                    List<ColumnMember> columns = new List<ColumnMember>();
                    foreach (var prop in typeof(T).GetProperties())
                    {
                        ColumnAttribute columnAttribute = (ColumnAttribute)prop.GetCustomAttributes(typeof(ColumnAttribute), false).FirstOrDefault();

                        if (columnAttribute != null)
                        {
                            columns.Add(new ColumnMember()
                            {
                                ColumnName = columnAttribute.Name,
                                PropertyName = prop.Name
                            });
                        }
                        else
                        {
                            KeyAttribute keyAttribute = (KeyAttribute)prop.GetCustomAttributes(typeof(KeyAttribute), false).FirstOrDefault();
                            if(keyAttribute != null)
                            {
                                Type type = prop.PropertyType;
                                foreach(var pr in type.GetProperties())
                                {
                                    columnAttribute = (ColumnAttribute)pr.GetCustomAttributes(typeof(ColumnAttribute), false).FirstOrDefault();

                                    if (columnAttribute != null)
                                    {
                                        columns.Add(new ColumnMember()
                                        {
                                            ColumnName = columnAttribute.Name,
                                            PropertyName = pr.Name
                                        });
                                    }
                                }
                            }
                        }
                    }

                    _columns[tableName] = columns;
                }

                return _columns[tableName];
            }
        }

        internal string GetColumnsFormated<T>()
        {
            string tableName = GetTableName(typeof(T));
            List<string> columns = new List<string>();
            foreach (var column in GetColumns<T>())
            {
                columns.Add($"{tableName}.{column.ColumnName} AS {column.PropertyName}");
            }
            return String.Join(", ", columns);
        }

        internal MethodInfo GetMethodInfo(string methodName, Type type)
        {
            lock (_methods)
            {
                if (!_methods.ContainsKey(methodName))
                {
                    _methods[methodName] = type.GetMethod(methodName);
                }
                return _methods[methodName];
            }
        }
    }

    public class ColumnMember
    {
        public string ColumnName { get; set; }
        public string PropertyName { get; set; }
    }
}