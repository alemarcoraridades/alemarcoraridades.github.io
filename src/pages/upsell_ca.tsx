import React, { useEffect } from "react";

export default function Upsell_ca() {
  useEffect(() => {
    // Carrega o script da Kiwify dinamicamente
    const script = document.createElement("script");
    script.src = "https://snippets.kiwify.com/upsell/upsell.min.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="font-inter bg-gray-50 text-gray-900 min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto text-center">

        {/* Título */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
          Oferta Especial <span className="text-yellow-500">Somente Agora</span>
        </h1>

        {/* Sub */}
        <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto mb-10">
          Aproveite esta condição exclusiva disponível apenas nesta etapa.
        </p>

        {/* Imagem (substitua quando quiser) */}
        <div className="flex justify-center mb-10">
          <img
            src="/upsell_2.png"
            alt="Oferta Especial"
            className="w-[500px] md:w-[657px] rounded-2xl shadow-xl"
          />
        </div>



{/* Conteúdo resumido do upsell */}
<div className="bg-white p-8 rounded-2xl shadow-lg mb-10 text-left">
  <h2 className="text-2xl font-bold mb-4">Complete Seu Kit — Oferta Exclusiva Agora</h2>

  <p className="text-lg mb-6 opacity-90">
    Já que você acabou de garantir o guia para comprar seu carro antigo com segurança,
    aqui está a chance de complementar sua jornada com o material perfeito para quem quer
    **manter o motor AP funcionando redondo**, economizar e evitar problemas depois da compra.
  </p>

  <ul className="list-disc list-inside space-y-3 text-lg leading-relaxed">
    <li>
      <strong>Conhecimento prático imediato:</strong> diagnóstico simples, passo a passo
      e cuidados essenciais para qualquer motor AP.
    </li>

    <li>
      <strong>Economia real:</strong> evite gastos desnecessários entendendo o que realmente
      precisa ser feito — e o que é apenas "empurroterapia".
    </li>

    <li>
      <strong>Conteúdo visual e direto ao ponto:</strong> fotos, explicações claras e
      orientações fáceis de aplicar mesmo para iniciantes.
    </li>

    <li>
      <strong>Ideal para quem acabou de comprar um carro antigo:</strong> descubra como
      aumentar a vida útil do motor, prevenir falhas e reduzir riscos logo nos primeiros dias.
    </li>

    <li>
      <strong>Perfeito para AP 1.6, 1.8 e 2.0:</strong> Gol, Parati, Voyage, Passat, Santana,
      Saveiro e diversos outros modelos.
    </li>

    <li>
      Complementa 100% o material que você acabou de adquirir — compra segura + manutenção simples.
    </li>
  </ul>
</div>




        {/* Conteúdo resumido do upsell */}
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-10 text-left">
          <h2 className="text-2xl font-bold mb-4">O que você vai receber:</h2>
          <ul className="list-disc list-inside space-y-2 text-lg">
            <li>🔥 Conteúdo extra exclusivo</li>
            <li>🔧 Complemento perfeito para seu ebook</li>
            <li>📘 Material prático e direto ao ponto</li>
          </ul>
        </div>
        {/* Botão de Upsell - Kiwify */}
        <div
          style={{
          textAlign: "center"
          }}
          id="kiwify-upsell-eLZOieE"
          data-upsell-url=""
          data-downsell-url=""
        >
        <button
          id="kiwify-upsell-trigger-eLZOieE"
          style={{
          backgroundColor: "#5383ad",
          padding: "12px 16px",
          cursor: "pointer",
          color: "#FFFFFF",
          fontWeight: 600,
          borderRadius: "4px",
          border: "1px solid #5383ad",
          fontSize: "20px"
        }}
        >
        Sim, eu aceito essa oferta especial por 49,90!
        </button>

        <div
          id="kiwify-upsell-cancel-trigger-eLZOieE"
          style={{
            marginTop: "1rem",
            cursor: "pointer",
            fontSize: "16px",
            textDecoration: "underline",
            fontFamily: "sans-serif"
          }}
       >
       Não, eu gostaria de recusar essa oferta
       </div>
     </div>

     {/* Script do Kiwify */}
     <script src="https://snippets.kiwify.com/upsell/upsell.min.js"></script>

      </div>
    </div>
  );
}

