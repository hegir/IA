namespace IA.Model.Base
{
    public interface IEntity<TK>
    {
        TK Id { get; set; }
    }
}