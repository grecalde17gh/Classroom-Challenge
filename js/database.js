const SUPABASE_URL="https://ygumqtxirstskgnvukvi.supabase.co";
const SUPABASE_KEY="sb_publishable_UbM71RjGxBQRpIBDyi4M4Q_WykPatop";
window.DB={
 async req(path,{method="GET",body}={}){const r=await fetch(SUPABASE_URL+"/rest/v1/"+path,{method,headers:{apikey:SUPABASE_KEY,Authorization:"Bearer "+SUPABASE_KEY,"Content-Type":"application/json",Prefer:"return=representation"},body:body?JSON.stringify(body):undefined});if(!r.ok)throw Error((await r.text())||"Error de Supabase");const t=await r.text();return t?JSON.parse(t):null},
 async findSession(code){const rows=await this.req("sessions?code=eq."+encodeURIComponent(code.toUpperCase())+"&select=*");return rows?.[0]||null},
 async joinTeam(sessionId,name){const rows=await this.req("teams",{method:"POST",body:{session_id:sessionId,name}});return rows[0]},
 async createGame(sessionId,teamId){const rows=await this.req("games",{method:"POST",body:{session_id:sessionId,team_id:teamId,total_questions:24}});return rows[0]},
 async saveAnswer(gameId,q,choice,r){await this.req("answers",{method:"POST",body:{game_id:gameId,question_id:q.id,category:q.category,selected_answer:choice,correct_answer:q.correct,is_correct:r.ok,response_time:+r.seconds.toFixed(2),points:r.earned+r.bonus}})},
 async finishGame(gameId,r){await this.req("games?id=eq."+gameId,{method:"PATCH",body:{score:r.score,correct_answers:r.correct,total_questions:r.total,total_time:+r.time.toFixed(2),status:"finished",finished_at:new Date().toISOString()}})},
 async getTeams(sessionId){return await this.req("teams?session_id=eq."+sessionId+"&select=*&order=joined_at.asc")},
 async getGames(sessionId){return await this.req("games?session_id=eq."+sessionId+"&select=*&order=score.desc")},
 async getAnswers(gameIds){if(!gameIds.length)return[];return await this.req("answers?game_id=in.("+gameIds.join(",")+")&select=*")}
};