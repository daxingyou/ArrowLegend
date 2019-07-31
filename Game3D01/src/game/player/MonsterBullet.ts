import GamePro from "../GamePro";
import GameProType from "../GameProType";
import SysBullet from "../../main/sys/SysBullet";
import MonsterBulletAI from "../ai/MonsterBulletAI";
import MonsterBulletMove from "../move/MonsterBulletMove";
import Game from "../Game";
import { ui } from "./../../ui/layaMaxUI";
import BulletRotateScript from "../controllerScript/BulletRotateScript";

export default class MonsterBullet extends GamePro {
    static TAG: string = "MonsterBullet";
    public curLen: number;
    public moveLen: number;
    public sysBullet: SysBullet;

    private bullet3d: Laya.Sprite3D;
    constructor() {
        super(GameProType.MonstorArrow);
        this.setGameMove(new MonsterBulletMove());
        this.setGameAi(new MonsterBulletAI(this));
        this._bulletShadow = new ui.test.BulletShadowUI();
        Game.footLayer.addChild(this._bulletShadow);
        this.setShadowSize(19);
    }

    setBubble(sb: SysBullet): void {
        if (sb == null)  {
            console.error('这个子弹有问题');
            return;
        }
        if(sb.bulletMode == 10004 || sb.bulletMode == 10005)
        {
            this._bulletShadow && this._bulletShadow.removeSelf();
        }
        else{
            Game.footLayer.addChild(this._bulletShadow);
        }
        
        if (this.sysBullet && this.sysBullet.bulletMode == sb.bulletMode)  {
            return;
        }
        this.sysBullet = sb;
        var bullet: Laya.Sprite3D;
        bullet = (Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/bullets/" + sb.bulletMode + "/monster.lh"))) as Laya.Sprite3D;
        this.setSp3d(bullet);
        bullet.addComponent(BulletRotateScript)
        this.gamedata.bounce = sb.ejectionNum;
        // console.log("创建新的怪物子弹");
    }

    static getBullet(sb: SysBullet): MonsterBullet {
        let bullet: MonsterBullet;
        bullet = Laya.Pool.getItemByClass(MonsterBullet.TAG + sb.bulletMode, MonsterBullet);
        bullet.isDie = false;
        bullet.setBubble(sb);
        return bullet;
    }

    die(): void {
        if (this.isDie)  {
            return;
        }
        this.isDie = true;
        this.curLen = null;
        this.moveLen = null;
        this.stopAi();
        this._bulletShadow && this._bulletShadow.removeSelf();
        Laya.timer.frameOnce(1, this, () => {
            this.sp3d.parent && this.sp3d.parent.removeChild(this.sp3d);
        })
        Laya.timer.once(1000, this, () => {
            Laya.Pool.recover(MonsterBullet.TAG + this.sysBullet.bulletMode, this);
        })
    }
}