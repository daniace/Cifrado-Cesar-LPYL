<?php

namespace App\Policies;

use App\Models\Conversacion;
use App\Models\User;

class ConversacionPolicy
{
    /**
     * ¿Puede el usuario VER esta conversación?
     * Solo si es emisor o receptor.
     */
    public function view(User $user, Conversacion $conversacion): bool
    {
        return (int) $user->id === (int) $conversacion->id_emisor
            || (int) $user->id === (int) $conversacion->id_receptor;
    }

    /**
     * ¿Puede el usuario RESPONDER en esta conversación?
     * Misma lógica que view.
     */
    public function reply(User $user, Conversacion $conversacion): bool
    {
        return $this->view($user, $conversacion);
    }
}
