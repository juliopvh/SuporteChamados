export default function Header(){
    const usuariologado = "Técnico Suporte";
    return(
        <header className="header-container">
            <div className="header-content">
                <h2>Sistema de Chamados</h2>
                <span className="user-badge">
                    Usúario: {usuariologado}</span>
            </div>
        </header>
    );
}