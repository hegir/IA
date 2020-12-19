namespace IA.Repository.Base
{
    public interface ISessionManager
    {
        ISessionScope Create();
        ISessionScope Create(string name);
    }
}