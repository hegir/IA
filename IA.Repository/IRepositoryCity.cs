using IA.Repository.Base;
using IA.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace IA.Repository
{
    public interface IRepositoryCity : IRepositoryBase<int, City>
    {
        IEnumerable<City> FindAllCities(int limit, int offset, string sortingColumn, int order, string searchCityName, string searchPostCode, string searchMunicipalityCode, int? searchCanton);
        int CountAll(string searchCityName, string searchPostCode, string searchMunicipalityCode, int? searchCanton);

    }
}
